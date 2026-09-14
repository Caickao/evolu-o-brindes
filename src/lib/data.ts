import { prisma } from "@/lib/prisma";

export function parseProductIcon(images: string): string {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed[0] : "Package";
  } catch {
    return "Package";
  }
}

const productInclude = { category: true } as const;

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isFeatured: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getBestSellers(limit = 8) {
  return prisma.product.findMany({
    where: { isBestSeller: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isNew: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: productInclude });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: productInclude,
    take: limit,
  });
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

export async function getFilteredProducts(filters: ProductFilters) {
  const where: Record<string, unknown> = {};

  if (filters.categoria) {
    where.category = { slug: filters.categoria };
  } else if (filters.grupo) {
    where.category = { group: filters.grupo };
  }

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { description: { contains: filters.q } },
      { shortDescription: { contains: filters.q } },
    ];
  }

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (filters.sort === "menor-preco") orderBy = { price: "asc" };
  if (filters.sort === "maior-preco") orderBy = { price: "desc" };
  if (filters.sort === "novidades") orderBy = { createdAt: "desc" };

  return prisma.product.findMany({
    where,
    include: productInclude,
    orderBy,
  });
}
