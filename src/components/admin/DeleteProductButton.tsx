"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toast-store";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const push = useToastStore((s) => s.push);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    if (!res.ok) {
      push({ title: "Erro ao excluir produto", variant: "error" });
      return;
    }
    push({ title: "Produto excluído", variant: "success" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-gray-400 hover:text-red-600" aria-label="Excluir produto">
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
