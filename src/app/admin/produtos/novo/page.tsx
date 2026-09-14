import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Novo Produto" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Novo Produto</h2>
      <ProductForm
        categories={categories}
        initial={{
          name: "",
          description: "",
          shortDescription: "",
          price: 0,
          compareAtPrice: null,
          categoryId: "",
          icon: "Package",
          stock: 100,
          minQuantity: 1,
          customizable: true,
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
        }}
      />
    </div>
  );
}
