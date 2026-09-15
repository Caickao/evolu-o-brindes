import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { parseProductIcon, parseProductPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Editar Produto" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Editar Produto</h2>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription || "",
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          categoryId: product.categoryId,
          icon: parseProductIcon(product.images),
          photos: parseProductPhotos(product.photos),
          stock: product.stock,
          minQuantity: product.minQuantity,
          customizable: product.customizable,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          isBestSeller: product.isBestSeller,
        }}
      />
    </div>
  );
}
