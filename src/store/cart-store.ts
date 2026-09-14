"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

type Coupon = { code: string; percentOff: number } | null;

type CartState = {
  items: CartLine[];
  coupon: Coupon;
  addItem: (item: CartLine) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updatePersonalization: (productId: string, text: string) => void;
  setCoupon: (coupon: Coupon) => void;
  clearCart: () => void;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
  totalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(i.minQuantity, quantity) }
              : i
          ),
        })),

      updatePersonalization: (productId, text) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, personalization: text } : i
          ),
        })),

      setCoupon: (coupon) => set({ coupon }),

      clearCart: () => set({ items: [], coupon: null }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      discount: () => {
        const { coupon } = get();
        if (!coupon) return 0;
        return (get().subtotal() * coupon.percentOff) / 100;
      },

      total: () => Math.max(0, get().subtotal() - get().discount()),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "evolucao-cart" }
  )
);
