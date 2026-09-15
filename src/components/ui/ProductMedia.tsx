import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";

/**
 * Mostra a primeira foto real do produto quando existir; cai automaticamente
 * no ícone de identidade visual (placeholder) enquanto não houver foto
 * cadastrada. Mesma API do ProductImage para não exigir mudanças em quem já
 * usa `className`/`iconClassName`.
 */
export function ProductMedia({
  photos,
  icon,
  name,
  className,
  iconClassName,
  priority,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  photos: string[];
  icon?: string | null;
  name: string;
  className?: string;
  iconClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const mainPhoto = photos[0];

  if (!mainPhoto) {
    return <ProductImage icon={icon} name={name} className={className} iconClassName={iconClassName} />;
  }

  return (
    <div className={cn("relative overflow-hidden bg-brand-ivory", className)}>
      <Image
        src={mainPhoto}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
