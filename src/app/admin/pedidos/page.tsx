import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = { title: "Pedidos" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Pedidos ({orders.length})</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
              <th className="py-3 pr-4">Pedido</th>
              <th className="py-3 pr-4">Cliente</th>
              <th className="py-3 pr-4">Data</th>
              <th className="py-3 pr-4">Itens</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
