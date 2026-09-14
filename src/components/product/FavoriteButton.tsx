"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast-store";

export function FavoriteButton({
  productId,
  className,
  initialFavorited,
}: {
  productId: string;
  className?: string;
  initialFavorited?: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const push = useToastStore((s) => s.push);
  const [favorited, setFavorited] = useState(!!initialFavorited);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resync optimistic state when navigating between products
    setFavorited(!!initialFavorited);
  }, [initialFavorited]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      push({
        title: "Faça login para favoritar",
        description: "Crie sua conta para salvar produtos favoritos.",
        variant: "info",
      });
      router.push("/login");
      return;
    }

    setLoading(true);
    const next = !favorited;
    setFavorited(next);

    try {
      const res = await fetch("/api/favorites", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("failed");
      push({
        title: next ? "Adicionado aos favoritos" : "Removido dos favoritos",
        variant: "success",
      });
    } catch {
      setFavorited(!next);
      push({ title: "Não foi possível atualizar os favoritos", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-transform hover:scale-105",
        className
      )}
    >
      <Heart
        className={cn("h-4 w-4 transition-colors", favorited ? "fill-brand-gold text-brand-gold" : "text-brand-black")}
      />
    </button>
  );
}
