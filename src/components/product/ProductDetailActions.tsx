"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import { parseProductIcon } from "@/lib/data";
import type { ProductWithCategory } from "@/lib/types";

export function ProductDetailActions({ product }: { product: ProductWithCategory }) {
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [personalization, setPersonalization] = useState("");
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);

  function updateQuantity(delta: number) {
    setQuantity((q) => Math.max(product.minQuantity, q + delta));
  }

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: parseProductIcon(product.images),
      categoryIcon: product.category.icon || "Package",
      quantity,
      personalization,
      minQuantity: product.minQuantity,
    });
    push({ title: "Produto adicionado ao carrinho", description: product.name, variant: "success" });
  }

  return (
    <div className="flex flex-col gap-5">
      {product.customizable && (
        <div>
          <label htmlFor="personalization" className="mb-2 block text-sm font-semibold text-brand-black">
            Personalização (nome, texto ou observações)
          </label>
          <textarea
            id="personalization"
            value={personalization}
            onChange={(e) => setPersonalization(e.target.value)}
            rows={3}
            placeholder="Ex: Nome do clube, texto do brasão, cores desejadas..."
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-brand-gold"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-gray-200">
          <button
            onClick={() => updateQuantity(-1)}
            className="flex h-11 w-11 items-center justify-center text-gray-500 hover:text-brand-black disabled:opacity-30"
            disabled={quantity <= product.minQuantity}
            aria-label="Diminuir quantidade"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold">{quantity}</span>
          <button
            onClick={() => updateQuantity(1)}
            className="flex h-11 w-11 items-center justify-center text-gray-500 hover:text-brand-black"
            aria-label="Aumentar quantidade"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-black px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold hover:text-brand-black"
        >
          <ShoppingBag className="h-4 w-4" /> Adicionar ao Carrinho
        </button>
      </div>

      {product.minQuantity > 1 && (
        <p className="text-xs text-gray-400">Pedido mínimo de {product.minQuantity} unidades para este produto.</p>
      )}
    </div>
  );
}
