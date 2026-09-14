import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Tone = "gold" | "black" | "white" | "red";

const toneClasses: Record<Tone, string> = {
  gold: "bg-brand-gold text-brand-black",
  black: "bg-brand-black text-white",
  white: "bg-white text-brand-black border border-gray-200",
  red: "bg-red-600 text-white",
};

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
