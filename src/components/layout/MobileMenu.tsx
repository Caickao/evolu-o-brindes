"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/utils";
import type { CategoryGroup } from "@/lib/types";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  open,
  onClose,
  categoryGroups,
}: {
  open: boolean;
  onClose: () => void;
  categoryGroups: CategoryGroup[];
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Foco preso dentro do painel + fechar com Esc, enquanto o menu está aberto.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[90] transition-opacity duration-300 md:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      inert={!open}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="font-display text-lg font-bold">Menu</span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col p-5">
          <Link href="/" onClick={onClose} className="border-b border-gray-100 py-4 text-base font-semibold">
            Início
          </Link>
          <Link href="/produtos" onClick={onClose} className="border-b border-gray-100 py-4 text-base font-semibold">
            Todos os Produtos
          </Link>

          {categoryGroups.map((group) => (
            <div key={group.group} className="border-b border-gray-100">
              <button
                className="flex w-full items-center justify-between py-4 text-base font-semibold"
                aria-expanded={openGroup === group.group}
                onClick={() => setOpenGroup(openGroup === group.group ? null : group.group)}
              >
                {group.group}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openGroup === group.group && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid overflow-hidden transition-all duration-300",
                  openGroup === group.group ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                )}
              >
                <div className="min-h-0 flex flex-col gap-1">
                  {group.categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/produtos?categoria=${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-black"
                    >
                      <DynamicIcon name={cat.icon} className="h-4 w-4 text-brand-gold-dark" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Link href="/sobre" onClick={onClose} className="border-b border-gray-100 py-4 text-base font-semibold">
            Sobre Nós
          </Link>
          <Link href="/contato" onClick={onClose} className="border-b border-gray-100 py-4 text-base font-semibold">
            Contato
          </Link>
        </nav>

        <div className="p-5">
          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full bg-brand-black py-3 text-sm font-bold uppercase tracking-wide text-white"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
