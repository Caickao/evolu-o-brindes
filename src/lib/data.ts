import { prisma } from "@/lib/prisma";

export function parseProductIcon(images: string): string {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed[0] : "Package";
  } catch {
    return "Package";
  }
}

/** Fotos reais do produto (galeria). Vazio até que alguém cadastre uma foto. */
export function parseProductPhotos(photos: string): string[] {
  try {
    const parsed = JSON.parse(photos);
    return Array.isArray(parsed) ? parsed.filter((p) => typeof p === "string" && p.length > 0) : [];
  } catch {
    return [];
  }
}

const productInclude = { category: true } as const;

type PriceLike = { toString(): string };
type WithPrices = { price: PriceLike; compareAtPrice: PriceLike | null };

/**
 * Preço e preço-de vêm do banco como `Prisma.Decimal` (ver prisma/schema.prisma).
 * O resto do app (carrinho, cards, formulários) sempre trabalhou com `number`
 * simples — normalizamos aqui, na borda de leitura, para que nenhum outro
 * arquivo precise saber que o valor passou por um banco Decimal.
 */
export function normalizeProduct<T extends WithPrices>(product: T) {
  return {
    ...product,
    price: Number(product.price.toString()),
    compareAtPrice: product.compareAtPrice != null ? Number(product.compareAtPrice.toString()) : null,
  };
}

export async function getFeaturedProducts(limit = 4) {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(normalizeProduct);
}

export async function getBestSellers(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isBestSeller: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(normalizeProduct);
}

export async function getNewProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isNew: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(normalizeProduct);
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug }, include: productInclude });
  return product ? normalizeProduct(product) : null;
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  const products = await prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: productInclude,
    take: limit,
  });
  return products.map(normalizeProduct);
}

export type ProductFilters = {
  categoria?: string;
  grupo?: string;
  q?: string;
  sort?: "relevancia" | "menor-preco" | "maior-preco" | "novidades";
};

export async function getUserFavoriteIds(userId?: string | null) {
  if (!userId) return new Set<string>();
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { productId: true },
  });
  return new Set(favorites.map((f) => f.productId));
}

export const PRODUCTS_PER_PAGE = 12;

export async function getFilteredProducts(filters: ProductFilters, page = 1) {
  const where: Record<string, unknown> = {};

  if (filters.categoria) {
    where.category = { slug: filters.categoria };
  } else if (filters.grupo) {
    where.category = { group: filters.grupo };
  }

  const q = filters.q?.trim();
  if (q) {
    const searchOr: Record<string, unknown>[] = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
    ];

    // Só busca pelo nome da categoria quando não há filtro de categoria/grupo já aplicado,
    // para não misturar dois critérios de categoria diferentes na mesma consulta.
    if (!filters.categoria && !filters.grupo) {
      searchOr.push({ category: { name: { contains: q, mode: "insensitive" } } });
    }

    where.OR = searchOr;
  }

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (filters.sort === "menor-preco") orderBy = { price: "asc" };
  if (filters.sort === "maior-preco") orderBy = { price: "desc" };
  if (filters.sort === "novidades") orderBy = { createdAt: "desc" };

  const safePage = Math.max(1, page);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (safePage - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(normalizeProduct),
    total,
    totalPages: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
    page: safePage,
  };
}
