"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useToastStore } from "@/store/toast-store";

const ICON_OPTIONS = [
  "CircleDot", "Pin", "Flag", "ShieldCheck", "Layers", "Disc", "Shield",
  "Trophy", "Medal", "Award", "HeartHandshake", "Coffee", "Key", "Shirt",
  "PackageOpen", "Gift", "PartyPopper", "Sparkles", "Users", "Package", "Star", "Crown", "Box",
];

export type CategoryFormValues = {
  id?: string;
  name: string;
  group: string;
  description: string;
  icon: string;
  order: number;
};

export function CategoryForm({
  initial,
  existingGroups,
}: {
  initial: CategoryFormValues;
  existingGroups: string[];
}) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const push = useToastStore((s) => s.push);

  function update<K extends keyof CategoryFormValues>(key: K, value: CategoryFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = form.id ? `/api/admin/categories/${form.id}` : "/api/admin/categories";
      const method = form.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      const data = await res.json();
      if (!res.ok) {
        push({ title: data.error || "Erro ao salvar categoria", variant: "error" });
        return;
      }
      push({ title: "Categoria salva com sucesso!", variant: "success" });
      router.push("/admin/categorias");
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
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Ex: Canecas"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
            Grupo (seção do menu)
          </label>
          <input
            required
            list="grupos-existentes"
            value={form.group}
            onChange={(e) => update("group", e.target.value)}
            placeholder="Ex: Personalizados"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
          />
          <datalist id="grupos-existentes">
            {existingGroups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
          <p className="mt-1 text-[11px] text-gray-400">
            Use um grupo já existente para agrupar no mesmo menu, ou digite um novo.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Descrição</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Aparece no topo da página de catálogo dessa categoria."
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
            Ordem de exibição
          </label>
          <input
            required
            type="number"
            value={form.order}
            onChange={(e) => update("order", Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Ícone</label>
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

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Categoria"}
      </Button>
    </form>
  );
}
