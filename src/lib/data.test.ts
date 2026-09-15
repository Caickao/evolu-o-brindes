import { describe, expect, it } from "vitest";
import { normalizeProduct, parseProductIcon, parseProductPhotos } from "./data";

describe("normalizeProduct", () => {
  it("converte price/compareAtPrice de Decimal (objeto) para number", () => {
    const raw = {
      id: "1",
      name: "Troféu",
      price: { toString: () => "129.90" },
      compareAtPrice: { toString: () => "159.90" },
    };
    const result = normalizeProduct(raw);
    expect(result.price).toBe(129.9);
    expect(result.compareAtPrice).toBe(159.9);
    expect(typeof result.price).toBe("number");
  });

  it("mantém compareAtPrice null quando o produto não tem preço promocional", () => {
    const raw = { id: "2", name: "Caneca", price: { toString: () => "34.90" }, compareAtPrice: null };
    const result = normalizeProduct(raw);
    expect(result.compareAtPrice).toBeNull();
  });
});

describe("parseProductIcon", () => {
  it("extrai o primeiro ícone do JSON salvo", () => {
    expect(parseProductIcon('["Trophy"]')).toBe("Trophy");
  });

  it("cai em 'Package' quando o JSON é inválido", () => {
    expect(parseProductIcon("não é json")).toBe("Package");
  });

  it("cai em 'Package' quando o JSON não é um array", () => {
    expect(parseProductIcon('{"icon":"Trophy"}')).toBe("Package");
  });
});

describe("parseProductPhotos", () => {
  it("retorna a lista de URLs salva", () => {
    expect(parseProductPhotos('["https://a.com/1.jpg","https://a.com/2.jpg"]')).toEqual([
      "https://a.com/1.jpg",
      "https://a.com/2.jpg",
    ]);
  });

  it("retorna array vazio quando não há fotos", () => {
    expect(parseProductPhotos("[]")).toEqual([]);
  });

  it("retorna array vazio quando o JSON é inválido, sem lançar erro", () => {
    expect(parseProductPhotos("")).toEqual([]);
  });

  it("filtra entradas vazias ou que não são string", () => {
    expect(parseProductPhotos('["https://a.com/1.jpg", "", null]')).toEqual(["https://a.com/1.jpg"]);
  });
});
