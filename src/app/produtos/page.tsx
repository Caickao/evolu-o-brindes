import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { auth } from "@/lib/auth";
import { getFilteredProducts, getUserFavoriteIds, type ProductFilters } from "@/lib/data";
import { ALL_CATEGORIES, CATEGORY_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo completo de produtos personalizados: pins, distintivos, troféus, medalhas, canecas, chaveiros, camisas e muito mais.",
};

type SearchParams = Promise<{
  categoria?: string;
  grupo?: string;
  q?: string;
  sort?: string;
}>;

export default async function ProdutosPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const session = await auth();

  const filters: ProductFilters = {
    categoria: params.categoria,
    grupo: params.grupo,
    q: params.q,
    sort: params.sort as ProductFilters["sort"],
  };

  const [products, favoriteIds] = await Promise.all([
    getFilteredProducts(filters),
    getUserFavoriteIds(session?.user?.id),
  ]);

  const activeCategory = ALL_CATEGORIES.find((c) => c.slug === params.categoria);

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-dark">
          {activeCategory ? activeCategory.name : params.grupo || "Catálogo"}
        </p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          {params.q ? `Resultados para "${params.q}"` : activeCategory ? activeCategory.name : "Todos os Produtos"}
        </h1>
        {activeCategory && <p className="mt-2 max-w-2xl text-sm text-gray-500">{activeCategory.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-8">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-black">Categorias</p>
              <Link
                href="/produtos"
                className={cn(
                  "mb-1 block rounded-lg px-3 py-2 text-sm hover:bg-gray-50",
                  !params.categoria && !params.grupo ? "bg-brand-black text-white" : "text-gray-600"
                )}
              >
                Todos os Produtos
              </Link>
              {CATEGORY_GROUPS.map((group) => (
                <div key={group.group} className="mt-4">
                  <p className="mb-1.5 px-3 text-xs font-bold uppercase tracking-wide text-brand-gold-dark">
                    {group.group}
                  </p>
                  {group.categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/produtos?categoria=${cat.slug}`}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50",
                        params.categoria === cat.slug ? "bg-brand-black text-white" : "text-gray-600"
                      )}
                    >
                      <DynamicIcon name={cat.icon} className="h-4 w-4" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <p className="text-sm text-gray-500">{products.length} produtos encontrados</p>
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="sort" className="text-gray-500">
                Ordenar por
              </label>
              <SortSelect defaultValue={params.sort || "relevancia"} />
            </div>
          </div>

          <details className="mb-6 rounded-xl border border-gray-100 p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide">Filtrar por categoria</summary>
            <div className="mt-4 flex flex-col gap-1">
              <Link href="/produtos" className="rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Todos os Produtos
              </Link>
              {ALL_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/produtos?categoria=${cat.slug}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <DynamicIcon name={cat.icon} className="h-4 w-4" />
                  {cat.name}
                </Link>
              ))}
            </div>
          </details>

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-20 text-center">
              <PackageSearch className="h-10 w-10 text-gray-300" />
              <p className="text-lg font-semibold">Nenhum produto encontrado</p>
              <p className="max-w-sm text-sm text-gray-500">
                Tente buscar por outro termo ou fale com a gente para um projeto sob medida.
              </p>
              <Link href="/contato" className="text-sm font-bold uppercase text-brand-gold-dark">
                Solicitar orçamento personalizado
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} favorited={favoriteIds.has(product.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
