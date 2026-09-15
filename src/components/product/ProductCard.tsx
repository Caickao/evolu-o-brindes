import Link from "next/link";
import { Star } from "lucide-react";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "./FavoriteButton";
import { AddToCartButton } from "./AddToCartButton";
import { formatPrice } from "@/lib/utils";
import { parseProductIcon, parseProductPhotos } from "@/lib/data";
import type { ProductWithCategory } from "@/lib/types";

export function ProductCard({
  product,
  favorited,
}: {
  product: ProductWithCategory;
  favorited?: boolean;
}) {
  const discount = product.compareAtPrice
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : null;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-xl"
    >
      <div className="relative aspect-square">
        <ProductMedia
          photos={parseProductPhotos(product.photos)}
          icon={parseProductIcon(product.images)}
          name={product.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge tone="black">Novo</Badge>}
          {product.isBestSeller && <Badge tone="gold">Mais Vendido</Badge>}
          {discount && <Badge tone="red">-{discount}%</Badge>}
        </div>
        <FavoriteButton
          productId={product.id}
          initialFavorited={favorited}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-gold-dark">
          {product.category.name}
        </p>
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-brand-black">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
          {product.rating.toFixed(1)}
          <span className="text-gray-300">•</span>
          {product.reviewsCount} avaliações
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {product.compareAtPrice && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
            )}
            <p className="font-display text-lg font-bold text-brand-black">{formatPrice(product.price)}</p>
            {product.minQuantity > 1 && (
              <p className="text-[11px] text-gray-400">mín. {product.minQuantity} un.</p>
            )}
          </div>
          <AddToCartButton product={product} iconOnly />
        </div>
      </div>
    </Link>
  );
}
