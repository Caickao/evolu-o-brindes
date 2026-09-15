import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export const metadata: Metadata = { title: "Categorias" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Categorias ({categories.length})</h2>
        <Link
          href="/admin/categorias/nova"
          className="flex items-center gap-2 rounded-full bg-brand-black px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-charcoal"
        >
          <Plus className="h-4 w-4" /> Nova Categoria
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-black text-brand-gold">
              <DynamicIcon name={category.icon ?? undefined} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{category.name}</p>
              <p className="text-xs text-gray-400">
                {category.group} • {category._count.products} produto(s) • /{category.slug}
              </p>
            </div>
            <Link
              href={`/admin/categorias/${category.id}`}
              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
            >
              Editar
            </Link>
            <DeleteCategoryButton categoryId={category.id} />
          </div>
        ))}

        {categories.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">Nenhuma categoria cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}
