import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Tag, ExternalLink } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tag },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-ivory">
      <div className="container-page py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-dark">Painel Administrativo</p>
            <h1 className="font-display text-3xl font-bold">Evolução Brindes</h1>
          </div>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand-black">
            Ver site <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm hover:text-brand-black"
              >
                <link.icon className="h-4 w-4 text-brand-gold-dark" />
                {link.label}
              </Link>
            ))}
          </aside>
          <div className="rounded-2xl bg-white p-6 shadow-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
