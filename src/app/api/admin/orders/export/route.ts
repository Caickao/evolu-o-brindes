import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABEL } from "@/lib/order-status";

function csvEscape(value: string) {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return new Response("Acesso negado", { status: 403 });

  const orders = await prisma.order.findMany({
    include: { user: true, address: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Pedido",
    "Data",
    "Status",
    "Cliente",
    "Email",
    "Telefone",
    "Endereço",
    "Itens",
    "Personalização",
    "Subtotal",
    "Desconto",
    "Total",
    "Cupom",
    "Observações",
  ];

  const rows = orders.map((order) => [
    order.number,
    formatDate(order.createdAt),
    ORDER_STATUS_LABEL[order.status] || order.status,
    order.user.name,
    order.user.email,
    order.user.phone || "",
    order.address
      ? `${order.address.street}, ${order.address.number} - ${order.address.neighborhood}, ${order.address.city}/${order.address.state} - ${order.address.zipCode}`
      : "",
    order.items.map((i) => `${i.quantity}x ${i.productName}`).join(" | "),
    order.items
      .filter((i) => i.personalization)
      .map((i) => `${i.productName}: ${i.personalization}`)
      .join(" | "),
    Number(order.subtotal).toFixed(2),
    Number(order.discount).toFixed(2),
    Number(order.total).toFixed(2),
    order.couponCode || "",
    order.customerNotes || "",
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(";"))
    .join("\n");

  // BOM no início para o Excel reconhecer UTF-8 corretamente (acentos).
  const csvWithBom = "﻿" + csv;

  return new Response(csvWithBom, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
