"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";

export function ProductGallery({
  photos,
  icon,
  name,
  badges,
  favoriteSlot,
}: {
  photos: string[];
  icon?: string | null;
  name: string;
  badges?: React.ReactNode;
  favoriteSlot?: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasPhotos = photos.length > 0;
  const active = photos[activeIndex] ?? photos[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl">
        {hasPhotos ? (
          <Image
            src={active}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <ProductImage icon={icon} name={name} className="h-full w-full" iconClassName="h-28 w-28" />
        )}
        {badges && <div className="absolute left-4 top-4 flex flex-col gap-1.5">{badges}</div>}
        {favoriteSlot}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((photo, index) => (
            <button
              key={photo}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                index === activeIndex ? "border-brand-gold" : "border-transparent"
              )}
              aria-label={`Ver foto ${index + 1} de ${name}`}
            >
              <Image src={photo} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

