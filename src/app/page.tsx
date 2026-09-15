import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryCard } from "@/components/product/CategoryCard";
import { auth } from "@/lib/auth";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewProducts,
  getUserFavoriteIds,
  getCategoryGroups,
} from "@/lib/data";
import { BENEFITS, CONTACT, TESTIMONIALS } from "@/lib/constants";

export default async function HomePage() {
  const session = await auth();
  const [featured, bestSellers, newProducts, favoriteIds, categoryGroups] = await Promise.all([
    getFeaturedProducts(4),
    getBestSellers(8),
    getNewProducts(4),
    getUserFavoriteIds(session?.user?.id),
    getCategoryGroups(),
  ]);
  const featuredCategories = categoryGroups.flatMap((g) => g.categories).slice(0, 9);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-black">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--color-gold) 0, var(--color-gold) 1px, transparent 1px, transparent 22px)",
            }}
          />
        </div>
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />

        <div className="container-page relative flex min-h-[560px] flex-col items-start justify-center gap-6 py-24 md:min-h-[640px]">
          <span className="flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold">
            Personalização Premium
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.1] text-white md:text-6xl">
            Produtos personalizados que <span className="gold-gradient-text">elevam</span> a identidade do seu clube e evento
          </h1>
          <p className="max-w-xl text-base text-gray-300 md:text-lg">
            Pins, distintivos, troféus, medalhas, canecas e brindes corporativos com acabamento
            premium — feitos sob medida para Desbravadores, igrejas, empresas e eventos.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/produtos" size="lg">
              Ver Produtos <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de um orçamento personalizado.")}`}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-brand-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page -mt-10 relative z-10 grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9">
        {featuredCategories.map((cat) => (
          <CategoryCard key={cat.slug} name={cat.name} slug={cat.slug} icon={cat.icon} />
        ))}
      </section>

      {featured.length > 0 && (
        <section className="container-page py-16 md:py-24">
          <SectionHeading
            eyebrow="Seleção Premium"
            title="Produtos em Destaque"
            description="Peças especiais escolhidas para causar impacto em premiações e eventos institucionais."
            className="mb-10"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} favorited={favoriteIds.has(product.id)} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-brand-ivory py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Os Favoritos"
              title="Mais Vendidos"
              description="Os produtos preferidos por clubes, igrejas e empresas em todo o Brasil."
              align="left"
            />
            <Link
              href="/produtos"
              className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-brand-gold-dark hover:text-brand-black"
            >
              Ver catálogo completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} favorited={favoriteIds.has(product.id)} />
            ))}
          </div>
        </div>
      </section>

      {newProducts.length > 0 && (
        <section className="container-page py-16 md:py-24">
          <SectionHeading eyebrow="Chegou Agora" title="Novidades" className="mb-10" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} favorited={favoriteIds.has(product.id)} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-brand-black py-16 md:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Por que a Evolução"
            title="Excelência em Cada Detalhe"
            light
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-brand-black">
                  <DynamicIcon name={benefit.icon} className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="Depoimentos" title="Quem Confia na Evolução" className="mb-12" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <Quote className="h-8 w-8 text-brand-gold" />
              <p className="flex-1 text-sm leading-relaxed text-gray-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-1 text-brand-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-gold" />
                ))}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-brand-black">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-gold py-16 text-center md:py-20">
        <div className="container-page relative flex flex-col items-center gap-5">
          <h2 className="max-w-2xl font-display text-3xl font-extrabold text-brand-black md:text-4xl">
            Tem um projeto especial em mente?
          </h2>
          <p className="max-w-xl text-sm text-brand-black/80 md:text-base">
            Fale agora com nossa equipe e receba um orçamento personalizado para o seu clube, igreja,
            evento ou empresa.
          </p>
          <Button
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de um orçamento personalizado.")}`}
            variant="secondary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com um Especialista
          </Button>
        </div>
      </section>
    </>
  );
}
