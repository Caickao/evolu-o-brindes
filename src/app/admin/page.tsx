import type { Metadata } from "next";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };
// Painel administrativo precisa sempre refletir o estado atual do banco —
// nunca servir uma versão em cache. Ver nota em src/app/layout.tsx sobre o
// `revalidate` herdado do layout raiz.
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({ select: { total: true, status: true } }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const cards = [
    { label: "Produtos Cadastrados", value: productCount, icon: Package },
    { label: "Pedidos Realizados", value: orderCount, icon: ShoppingCart },
    { label: "Clientes Cadastrados", value: userCount, icon: Users },
    { label: "Receita Total", value: formatPrice(revenue), icon: DollarSign },
  ];

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Visão Geral</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="flex flex-col gap-2 rounded-2xl border border-gray-100 p-5">
            <card.icon className="h-5 w-5 text-brand-gold-dark" />
            <p className="font-display text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-4 mt-10 font-display text-lg font-bold">Pedidos por Status</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {["RECEBIDO", "EM_PRODUCAO", "ENVIADO", "FINALIZADO", "CANCELADO"].map((status) => (
          <div key={status} className="rounded-xl bg-brand-ivory p-4 text-center">
            <p className="font-display text-xl font-bold">{statusCounts[status] || 0}</p>
            <p className="text-[11px] uppercase text-gray-500">{status.replace("_", " ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
