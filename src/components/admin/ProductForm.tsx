"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useToastStore } from "@/store/toast-store";
import { ALL_CATEGORIES } from "@/lib/constants";

const ICON_OPTIONS = Array.from(new Set(ALL_CATEGORIES.map((c) => c.icon))).concat([
  "Package",
  "Star",
  "Crown",
  "Box",
]);

export type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId: string;
  icon: string;
  stock: number;
  minQuantity: number;
  customizable: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
};

export function ProductForm({
  initial,
  categories,
}: {
  initial: ProductFormValues;
  categories: { id: string; name: string }[];
}) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const push = useToastStore((s) => s.push);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
      const method = form.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
          stock: Number(form.stock),
          minQuantity: Number(form.minQuantity),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        push({ title: data.error || "Erro ao salvar produto", variant: "error" });
        return;
      }
      push({ title: "Produto salvo com sucesso!", variant: "success" });
      router.push("/admin/produtos");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Nome</label>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Categoria</label>
          <select required value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold">
            <option value="">Selecione</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Descrição curta</label>
        <input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Descrição completa</label>
        <textarea required rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Preço (R$)</label>
          <input required type="number" step="0.01" value={form.price} onChange={(e) => update("price", Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Preço De (opcional)</label>
          <input type="number" step="0.01" value={form.compareAtPrice ?? ""} onChange={(e) => update("compareAtPrice", e.target.value ? Number(e.target.value) : null)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Estoque</label>
          <input required type="number" value={form.stock} onChange={(e) => update("stock", Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Qtd. Mínima</label>
          <input required type="number" value={form.minQuantity} onChange={(e) => update("minQuantity", Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Ícone do Produto</label>
        <div className="flex flex-wrap gap-2">
          {ICON_OPTIONS.map((icon) => (
            <button
              type="button"
              key={icon}
              onClick={() => update("icon", icon)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                form.icon === icon ? "border-brand-gold bg-brand-gold/10 text-brand-gold-dark" : "border-gray-200 text-gray-500"
              }`}
              aria-label={icon}
            >
              <DynamicIcon name={icon} className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[
          { key: "customizable" as const, label: "Personalizável" },
          { key: "isFeatured" as const, label: "Destaque" },
          { key: "isNew" as const, label: "Novo" },
          { key: "isBestSeller" as const, label: "Mais Vendido" },
        ].map((f) => (
          <label key={f.key} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form[f.key]} onChange={(e) => update(f.key, e.target.checked)} />
            {f.label}
          </label>
        ))}
      </div>

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Produto"}
      </Button>
    </form>
  );
}
