import { ReactNode } from "react";
import Link from "next/link";
import { User, Package, Heart, MapPin } from "lucide-react";
import { auth } from "@/lib/auth";

const links = [
  { href: "/conta", label: "Meus Dados", icon: User },
  { href: "/conta/pedidos", label: "Meus Pedidos", icon: Package },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
];

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-dark">Área do Cliente</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Olá, {session?.user?.name?.split(" ")[0]}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-brand-ivory hover:text-brand-black"
            >
              <link.icon className="h-4 w-4 text-brand-gold-dark" />
              {link.label}
            </Link>
          ))}
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
