import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold-dark">
          <span className="h-px w-6 bg-brand-gold-dark" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold md:text-4xl",
          light ? "text-white" : "text-brand-black"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("max-w-2xl text-sm md:text-base", light ? "text-gray-300" : "text-gray-500")}>
          {description}
        </p>
      )}
    </div>
  );
}
