"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import { useMounted } from "@/hooks/use-mounted";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, updatePersonalization, coupon, setCoupon, subtotal, discount, total } =
    useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);
  const push = useToastStore((s) => s.push);
  const router = useRouter();
  const { status } = useSession();
  const mounted = useMounted();

  async function applyCoupon() {
    if (!couponInput) return;
    setApplying(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        push({ title: data.error || "Cupom inválido", variant: "error" });
        return;
      }
      setCoupon({ code: data.code, percentOff: data.percentOff });
      push({ title: `Cupom ${data.code} aplicado!`, description: `${data.percentOff}% de desconto`, variant: "success" });
    } finally {
      setApplying(false);
    }
  }

  function goToCheckout() {
    if (status !== "authenticated") {
      push({ title: "Faça login para continuar", description: "Você precisa estar logado para finalizar o pedido.", variant: "info" });
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    router.push("/checkout");
  }

  if (!mounted) {
    return <div className="container-page py-24" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag className="h-14 w-14 text-gray-300" />
        <h1 className="font-display text-2xl font-bold">Seu carrinho está vazio</h1>
        <p className="max-w-sm text-sm text-gray-500">
          Explore nosso catálogo e encontre o produto personalizado perfeito para o seu clube ou evento.
        </p>
        <Button href="/produtos">Ver Produtos</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="mb-8 font-display text-3xl font-bold md:text-4xl">Meu Carrinho</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-2xl border border-gray-100 p-4">
              <Link href={`/produto/${item.slug}`} className="shrink-0">
                <ProductImage icon={item.categoryIcon} name={item.name} className="h-24 w-24 rounded-xl" iconClassName="h-10 w-10" />
              </Link>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/produto/${item.slug}`} className="font-display font-bold hover:text-brand-gold-dark">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remover item"
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <input
                  value={item.personalization}
                  onChange={(e) => updatePersonalization(item.productId, e.target.value)}
                  placeholder="Adicionar personalização (nome, texto, cores...)"
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-gold"
                />

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-brand-black disabled:opacity-30"
                      disabled={item.quantity <= item.minQuantity}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-brand-black"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-display font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-gray-100 p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Resumo do Pedido</h2>

          <div className="mb-4 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 px-3 py-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Cupom de desconto"
                className="w-full text-sm outline-none"
              />
            </div>
            <button
              onClick={applyCoupon}
              disabled={applying}
              className="rounded-full bg-brand-black px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-charcoal disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>

          {coupon && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <span>Cupom {coupon.code} aplicado</span>
              <button onClick={() => setCoupon(null)} aria-label="Remover cupom">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            {discount() > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Desconto</span>
                <span>-{formatPrice(discount())}</span>
              </div>
            )}
            <div className="gold-divider my-2" />
            <div className="flex justify-between font-display text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </div>

          <Button onClick={goToCheckout} fullWidth size="lg" className="mt-6">
            Finalizar Pedido
          </Button>
          <Link href="/produtos" className="mt-3 block text-center text-xs font-semibold text-gray-500 hover:text-brand-black">
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
