"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toast-store";

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const push = useToastStore((s) => s.push);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    const res = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      push({ title: data?.error || "Erro ao excluir categoria", variant: "error" });
      return;
    }
    push({ title: "Categoria excluída", variant: "success" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-gray-400 hover:text-red-600" aria-label="Excluir categoria">
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
