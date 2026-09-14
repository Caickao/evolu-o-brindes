import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export function CategoryCard({
  name,
  slug,
  icon,
}: {
  name: string;
  slug: string;
  icon: string;
}) {
  return (
    <Link
      href={`/produtos?categoria=${slug}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-black text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-black">
        <DynamicIcon name={icon} className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <span className="text-sm font-semibold leading-tight text-brand-black">{name}</span>
    </Link>
  );
}
