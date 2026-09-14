import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/order-status";

export const metadata: Metadata = { title: "Meus Pedidos" };

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <Package className="h-10 w-10 text-gray-300" />
        <p className="text-lg font-semibold">Você ainda não fez nenhum pedido</p>
        <Link href="/produtos" className="text-sm font-bold uppercase text-brand-gold-dark">
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Meus Pedidos</h2>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/conta/pedidos/${order.id}`}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-5 hover:border-brand-gold/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display font-bold">Pedido #{order.number}</p>
              <p className="text-xs text-gray-400">
                {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? "item" : "itens"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
              <p className="font-display font-bold">{formatPrice(order.total)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
