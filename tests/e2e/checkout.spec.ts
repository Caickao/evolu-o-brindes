import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TEST_NOTE = "Pedido de teste automatizado (Playwright)";
const TEST_ADDRESS_LABEL = "Casa Teste E2E";

test.describe("Checkout completo", () => {
  test.afterEach(async () => {
    // Este teste roda contra o banco real (não há banco de teste isolado
    // configurado) — por isso limpa o que criou logo depois, sempre, mesmo
    // se o teste falhar no meio do caminho. O pedido decrementa estoque de
    // verdade (transação da Fase 1) — como aqui só apagamos o pedido em vez
    // de "cancelar" via fluxo normal, devolvemos o estoque manualmente para
    // rodar o teste várias vezes sem drenar o estoque de teste.
    const testOrders = await prisma.order.findMany({
      where: { customerNotes: TEST_NOTE },
      include: { items: true },
    });
    for (const order of testOrders) {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
    await prisma.order.deleteMany({ where: { customerNotes: TEST_NOTE } });
    await prisma.address.deleteMany({ where: { label: TEST_ADDRESS_LABEL } });
  });

  test("cliente loga, adiciona produto personalizado ao carrinho e finaliza o pedido", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("seu@email.com").fill("cliente@exemplo.com");
    await page.getByPlaceholder("••••••••").fill("123456");
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.waitForURL("**/conta");

    await page.goto("/produto/arganel-premium-metalico");
    await page
      .getByPlaceholder("Ex: Nome do clube, texto do brasão, cores desejadas...")
      .fill("Teste automatizado — clube Águias Douradas");
    await page.getByRole("button", { name: "Adicionar ao Carrinho" }).first().click();
    await expect(page.getByText("Produto adicionado ao carrinho")).toBeVisible();

    await page.goto("/checkout");

    const streetField = page.getByPlaceholder("Rua");
    if (await streetField.isVisible().catch(() => false)) {
      await page.getByPlaceholder("Rótulo (Casa, Trabalho...)").fill(TEST_ADDRESS_LABEL);
      await page.getByPlaceholder("Destinatário").fill("Cliente Demonstração");
      await streetField.fill("Rua Teste E2E");
      await page.getByPlaceholder("Número").fill("100");
      await page.getByPlaceholder("Bairro").fill("Centro");
      await page.getByPlaceholder("Cidade").fill("São Paulo");
      await page.getByPlaceholder("UF").fill("SP");
      await page.getByPlaceholder("CEP").fill("01000-000");
      await page.getByRole("button", { name: "Salvar Endereço" }).click();
      await expect(page.getByText(TEST_ADDRESS_LABEL)).toBeVisible();
    }

    await page
      .getByPlaceholder("Alguma observação especial sobre a produção ou entrega?")
      .fill(TEST_NOTE);
    await page.getByRole("button", { name: "Confirmar Pedido" }).click();

    await expect(page.getByRole("heading", { name: "Pedido Recebido!" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Pedido #EV\d{6}-\d{4}/)).toBeVisible();

    const order = await prisma.order.findFirst({ where: { customerNotes: TEST_NOTE } });
    expect(order).not.toBeNull();
    expect(order?.status).toBe("RECEBIDO");
  });

  test("checkout exige login antes de finalizar", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login/);
  });
});
