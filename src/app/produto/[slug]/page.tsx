import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Sparkles, Truck, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { ProductCard } from "@/components/product/ProductCard";
import { auth } from "@/lib/auth";
import {
  getProductBySlug,
  getRelatedProducts,
  getUserFavoriteIds,
  parseProductIcon,
  parseProductPhotos,
} from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [related, favoriteIds] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    getUserFavoriteIds(session?.user?.id),
  ]);

  const discount = product.compareAtPrice
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
  };

  return (
    <div className="container-page py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-black">Início</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/produtos" className="hover:text-brand-black">Produtos</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/produtos?categoria=${product.category.slug}`} className="hover:text-brand-black">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery
          photos={parseProductPhotos(product.photos)}
          icon={parseProductIcon(product.images)}
          name={product.name}
          badges={
            <>
              {product.isNew && <Badge tone="black">Novo</Badge>}
              {product.isBestSeller && <Badge tone="gold">Mais Vendido</Badge>}
              {discount && <Badge tone="red">-{discount}%</Badge>}
            </>
          }
          favoriteSlot={
            <FavoriteButton
              productId={product.id}
              initialFavorited={favoriteIds.has(product.id)}
              className="absolute right-4 top-4"
            />
          }
        />

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-dark">
              {product.category.name}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
              {product.rating.toFixed(1)}
              <span className="text-gray-300">•</span>
              {product.reviewsCount} avaliações
            </div>
          </div>

          <div className="flex items-end gap-3">
            {product.compareAtPrice && (
              <p className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
            )}
            <p className="font-display text-3xl font-bold text-brand-black">{formatPrice(product.price)}</p>
          </div>

          <p className="leading-relaxed text-gray-600">{product.description}</p>

          <div className="gold-divider" />

          <ProductDetailActions product={product} />

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 p-3 text-xs text-gray-600">
              <Sparkles className="h-4 w-4 shrink-0 text-brand-gold-dark" /> 100% Personalizável
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 p-3 text-xs text-gray-600">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-gold-dark" /> Qualidade Garantida
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 p-3 text-xs text-gray-600">
              <Truck className="h-4 w-4 shrink-0 text-brand-gold-dark" /> Envio para todo o Brasil
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} favorited={favoriteIds.has(p.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
