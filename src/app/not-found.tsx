import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <PackageX className="h-16 w-16 text-brand-gold" />
      <h1 className="font-display text-4xl font-bold">404</h1>
      <p className="max-w-sm text-gray-500">
        Ops! A página que você procura não foi encontrada. Que tal explorar nosso catálogo?
      </p>
      <Button href="/produtos">Ver Produtos</Button>
    </div>
  );
}
