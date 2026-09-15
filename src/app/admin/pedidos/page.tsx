import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = { title: "Pedidos" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Pedidos ({orders.length})</h2>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- link de download de arquivo, não navegação entre páginas */}
        <a
          href="/api/admin/orders/export"
          className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-50"
        >
          <Download className="h-4 w-4" /> Exportar CSV
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
              <th className="py-3 pr-4">Pedido</th>
              <th className="py-3 pr-4">Cliente</th>
              <th className="py-3 pr-4">Data</th>
              <th className="py-3 pr-4">Itens</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-semibold">#{order.number}</td>
                <td className="py-3 pr-4 text-gray-600">{order.user.name}</td>
                <td className="py-3 pr-4 text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="py-3 pr-4 text-gray-500">{order.items.length}</td>
                <td className="py-3 pr-4 font-semibold">{formatPrice(order.total)}</td>
                <td className="py-3 pr-4">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">Nenhum pedido recebido ainda.</p>
        )}
      </div>
    </div>
  );
}
