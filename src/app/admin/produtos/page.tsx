import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/utils";
import { parseProductIcon } from "@/lib/data";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const metadata: Metadata = { title: "Produtos" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Produtos ({products.length})</h2>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 rounded-full bg-brand-black px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-charcoal"
        >
          <Plus className="h-4 w-4" /> Novo Produto
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-3">
            <ProductImage icon={parseProductIcon(product.images)} name={product.name} className="h-14 w-14 rounded-lg" iconClassName="h-6 w-6" />
            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-xs text-gray-400">{product.category.name} • Estoque: {product.stock}</p>
            </div>
            <p className="font-display font-bold">{formatPrice(product.price)}</p>
            <Link
              href={`/admin/produtos/${product.id}`}
              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
            >
              Editar
            </Link>
            <DeleteProductButton productId={product.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
