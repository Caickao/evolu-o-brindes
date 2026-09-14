"use client";

import { useToastStore } from "@/store/toast-store";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant ?? "info"];
        return (
          <div
            key={toast.id}
            className="animate-slide-up flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
            role="status"
          >
            <Icon
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0",
                toast.variant === "success" && "text-emerald-600",
                toast.variant === "error" && "text-red-600",
                (!toast.variant || toast.variant === "info") && "text-brand-gold-dark"
              )}
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-black">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-sm text-gray-500">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-400 hover:text-brand-black"
              aria-label="Fechar notificação"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
