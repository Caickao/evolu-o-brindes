import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = { title: "Meus Favoritos" };

export default async function FavoritesPage() {
  const session = await auth();

  const favorites = await prisma.favorite.findMany({
    where: { userId: session!.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <Heart className="h-10 w-10 text-gray-300" />
        <p className="text-lg font-semibold">Você ainda não tem favoritos</p>
        <Link href="/produtos" className="text-sm font-bold uppercase text-brand-gold-dark">
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Meus Favoritos</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {favorites.map((fav) => (
          <ProductCard key={fav.id} product={fav.product} favorited />
        ))}
      </div>
    </div>
  );
}
