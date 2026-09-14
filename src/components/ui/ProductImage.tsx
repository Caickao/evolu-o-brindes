import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";

export function ProductImage({
  icon,
  name,
  className,
  iconClassName,
}: {
  icon?: string | null;
  name: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-black via-brand-charcoal to-black",
        className
      )}
      aria-label={name}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-gold) 0, var(--color-gold) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-brand-gold/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-brand-gold/10 blur-2xl" />
      <DynamicIcon
        name={icon ?? undefined}
        strokeWidth={1.25}
        className={cn("relative text-brand-gold drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]", iconClassName ?? "h-14 w-14")}
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
    </div>
  );
}
