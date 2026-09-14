import { ReactNode } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-brand-black lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-6 lg:p-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-gold) 0, var(--color-gold) 1px, transparent 1px, transparent 22px)",
          }}
        />
        <img src="/logo.svg" alt="Evolução Brindes & Personalizados" className="relative h-14 w-auto brightness-0 invert" />
        <p className="relative max-w-sm text-center font-display text-2xl font-bold text-white">
          Personalização premium para quem valoriza a excelência
        </p>
        <div className="relative grid grid-cols-3 gap-6 text-center text-white">
          {[
            { icon: "ShieldCheck", label: "Qualidade" },
            { icon: "Sparkles", label: "Exclusividade" },
            { icon: "HeartHandshake", label: "Confiança" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <DynamicIcon name={f.icon} className="h-6 w-6 text-brand-gold" />
              <span className="text-xs uppercase tracking-wide">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
