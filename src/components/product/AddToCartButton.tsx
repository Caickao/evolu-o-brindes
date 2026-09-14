"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import type { ProductWithCategory } from "@/lib/types";
import { parseProductIcon } from "@/lib/data";

export function AddToCartButton({
  product,
  quantity = product.minQuantity,
  personalization = "",
  className,
  label = "Adicionar",
  iconOnly = false,
}: {
  product: ProductWithCategory;
  quantity?: number;
  personalization?: string;
  className?: string;
  label?: string;
  iconOnly?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: parseProductIcon(product.images),
      categoryIcon: product.category.icon || "Package",
      quantity: Math.max(quantity, product.minQuantity),
      personalization,
      minQuantity: product.minQuantity,
    });
    push({ title: "Produto adicionado ao carrinho", description: product.name, variant: "success" });
  }

  return (
    <button
      onClick={handleAdd}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-brand-black text-white transition-colors hover:bg-brand-gold hover:text-brand-black",
        iconOnly ? "h-10 w-10" : "px-5 py-2.5 text-xs font-bold uppercase tracking-wide",
        className
      )}
      aria-label="Adicionar ao carrinho"
    >
      <ShoppingBag className="h-4 w-4" />
      {!iconOnly && label}
    </button>
  );
}
