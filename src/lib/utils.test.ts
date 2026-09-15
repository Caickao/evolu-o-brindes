import { describe, expect, it } from "vitest";
import { formatPrice, slugify, generateOrderNumber } from "./utils";

// Intl.NumberFormat('pt-BR') usa espaço fino/não separável (U+00A0) entre
// "R$" e o valor, não um espaço comum — por isso o regex usa \s em vez de
// comparar com uma string literal.
describe("formatPrice", () => {
  it("formata um number comum em BRL", () => {
    expect(formatPrice(129.9)).toMatch(/^R\$\s129,90$/);
  });

  it("formata zero corretamente", () => {
    expect(formatPrice(0)).toMatch(/^R\$\s0,00$/);
  });

  it("aceita um Prisma.Decimal (objeto com toString) sem quebrar", () => {
    // Simula o formato que o Prisma devolve para colunas Decimal — ver
    // migração Float -> Decimal (Fase 1). Sem isso, todo valor monetário
    // vindo direto do banco quebraria essa função.
    const decimalLike = { toString: () => "299.00" };
    expect(formatPrice(decimalLike)).toMatch(/^R\$\s299,00$/);
  });
});

describe("slugify", () => {
  it("remove acentos e espaços", () => {
    expect(slugify("Troféu Prestígio Dourado")).toBe("trofeu-prestigio-dourado");
  });

  it("remove caracteres especiais", () => {
    expect(slugify("Kit Boas-Vindas & Cia!")).toBe("kit-boas-vindas-cia");
  });

  it("não deixa hífen duplicado ou nas pontas", () => {
    expect(slugify("  --Canecas--  ")).toBe("canecas");
  });
});

describe("generateOrderNumber", () => {
  it("segue o formato EVaammdd-XXXX", () => {
    expect(generateOrderNumber()).toMatch(/^EV\d{6}-\d{4}$/);
  });

  it("gera números diferentes em chamadas sucessivas", () => {
    const numbers = new Set(Array.from({ length: 20 }, () => generateOrderNumber()));
    // Com 4 dígitos aleatórios, é extremamente improvável colidir 20x seguidas.
    expect(numbers.size).toBeGreaterThan(1);
  });
});
