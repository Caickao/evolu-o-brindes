"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  Phone,
  Clock,
  LogOut,
  Package,
  MapPin,
  LayoutDashboard,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { useCartStore } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { MobileMenu } from "./MobileMenu";
import { MegaMenu } from "./MegaMenu";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CategoryGroup } from "@/lib/types";

export function Header({ categoryGroups }: { categoryGroups: CategoryGroup[] }) {
  const { data: session, status } = useSession();
  const mounted = useMounted();
  const totalItems = useCartStore((s) => s.totalItems());
  const cartCount = mounted ? totalItems : 0;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/produtos${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <>
      <div className="hidden bg-brand-black text-white md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-5 text-gray-300">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-gold" /> {CONTACT.hours}
            </span>
          </div>
          <div className="flex items-center gap-5 text-gray-300">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-gold"
            >
              <Phone className="h-3.5 w-3.5 text-brand-gold" /> WhatsApp
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-gold"
            >
              <InstagramIcon className="h-3.5 w-3.5 text-brand-gold" /> @evolucaobrindes
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow",
          scrolled && "shadow-md"
        )}
      >
        <div className="container-page flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Evolução Brindes & Personalizados">
            <img
              src="/logo.svg"
              alt="Evolução Brindes & Personalizados"
              width={220}
              height={56}
              className="h-10 w-auto md:h-12"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-semibold tracking-wide hover:text-brand-gold-dark">
              Início
            </Link>
            <div className="group relative">
              <button
                aria-haspopup="true"
                className="text-sm font-semibold tracking-wide hover:text-brand-gold-dark focus-visible:text-brand-gold-dark"
              >
                Produtos
              </button>
              <MegaMenu categoryGroups={categoryGroups} />
            </div>
            <Link href="/sobre" className="text-sm font-semibold tracking-wide hover:text-brand-gold-dark">
              Sobre Nós
            </Link>
            <Link href="/contato" className="text-sm font-semibold tracking-wide hover:text-brand-gold-dark">
              Contato
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Buscar produtos"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/conta/favoritos"
              aria-label="Favoritos"
              className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 md:flex"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <div className="group relative hidden md:block">
              <button
                aria-label="Minha conta"
                aria-haspopup="true"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
              </button>
              <div className="absolute right-0 top-full z-50 hidden w-64 pt-3 group-hover:block group-focus-within:block">
                <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-2xl">
                  {status === "authenticated" ? (
                    <>
                      <p className="truncate px-3 py-2 text-xs text-gray-400">
                        Olá, {session.user?.name?.split(" ")[0]}
                      </p>
                      <Link href="/conta" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                        <User className="h-4 w-4 text-brand-gold-dark" /> Meus Dados
                      </Link>
                      <Link href="/conta/pedidos" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                        <Package className="h-4 w-4 text-brand-gold-dark" /> Meus Pedidos
                      </Link>
                      <Link href="/conta/favoritos" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                        <Heart className="h-4 w-4 text-brand-gold-dark" /> Favoritos
                      </Link>
                      <Link href="/conta/enderecos" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                        <MapPin className="h-4 w-4 text-brand-gold-dark" /> Endereços
                      </Link>
                      {session.user?.role === "ADMIN" && (
                        <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                          <LayoutDashboard className="h-4 w-4 text-brand-gold-dark" /> Painel Admin
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Sair
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 p-2">
                      <Link
                        href="/login"
                        className="rounded-full bg-brand-black py-2 text-center text-sm font-semibold text-white hover:bg-brand-charcoal"
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/cadastro"
                        className="rounded-full border border-brand-black py-2 text-center text-sm font-semibold hover:bg-gray-50"
                      >
                        Criar Conta
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/carrinho"
              aria-label="Carrinho de compras"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-black">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="container-page py-3">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por pins, canecas, troféus..."
                  className="w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="rounded-full bg-brand-black px-4 py-1.5 text-xs font-semibold uppercase text-white"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} categoryGroups={categoryGroups} />
    </>
  );
}
