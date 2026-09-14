"use client";

import Link from "next/link";
import { CATEGORY_GROUPS } from "@/lib/constants";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export function MegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="absolute left-1/2 top-full z-50 hidden w-screen max-w-4xl -translate-x-1/2 pt-3 group-hover:block">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl">
        <div className="grid grid-cols-4 gap-8">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-brand-gold-dark">
                {group.group}
              </p>
              <ul className="flex flex-col gap-2.5">
                {group.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/produtos?categoria=${cat.slug}`}
                      onClick={onNavigate}
                      className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-brand-black"
                    >
                      <DynamicIcon name={cat.icon} className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="gold-divider my-6" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Não encontrou o que precisa? Fazemos projetos 100% personalizados.
          </p>
          <Link
            href="/contato"
            onClick={onNavigate}
            className="text-sm font-bold uppercase tracking-wide text-brand-gold-dark hover:text-brand-gold"
          >
            Solicitar orçamento →
          </Link>
        </div>
      </div>
    </div>
  );
}
