import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "Editar Categoria" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({ select: { group: true }, distinct: ["group"] }),
  ]);

  if (!category) notFound();

  const existingGroups = categories.map((c) => c.group);

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Editar Categoria</h2>
      <CategoryForm
        existingGroups={existingGroups}
        initial={{
          id: category.id,
          name: category.name,
          group: category.group,
          description: category.description || "",
          icon: category.icon || "Package",
          order: category.order,
        }}
      />
    </div>
  );
}
