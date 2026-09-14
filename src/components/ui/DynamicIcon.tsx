import * as Icons from "lucide-react";
import { Package, type LucideProps } from "lucide-react";

type IconName = keyof typeof Icons;

export function DynamicIcon({
  name,
  ...props
}: { name?: string | null } & LucideProps) {
  const IconComponent =
    name && (Icons as unknown as Record<string, typeof Package>)[name as IconName]
      ? (Icons as unknown as Record<string, typeof Package>)[name as IconName]
      : Package;

  return <IconComponent {...props} />;
}
