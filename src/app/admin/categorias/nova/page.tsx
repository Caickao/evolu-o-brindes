import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "Nova Categoria" };
export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({ select: { group: true }, distinct: ["group"] });
  const existingGroups = categories.map((c) => c.group);
  const maxOrder = await prisma.category.aggregate({ _max: { order: true } });

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Nova Categoria</h2>
      <CategoryForm
        existingGroups={existingGroups}
        initial={{
          name: "",
          group: "",
          description: "",
          icon: "Package",
          order: (maxOrder._max.order ?? -1) + 1,
        }}
      />
    </div>
  );
}
