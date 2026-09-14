import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/order-status";
import { parseProductIcon } from "@/lib/data";

export const metadata: Metadata = { title: "Detalhes do Pedido" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true },
  });

  if (!order || order.userId !== session!.user.id) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">Pedido #{order.number}</h2>
        <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </div>

      <p className="mb-6 text-xs text-gray-400">Realizado em {formatDate(order.createdAt)}</p>

      <div className="flex flex-col gap-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-2xl border border-gray-100 p-4">
            <ProductImage icon={parseProductIcon(item.productImage)} name={item.productName} className="h-20 w-20 rounded-xl" iconClassName="h-8 w-8" />
            <div className="flex-1">
              <p className="font-display font-bold">{item.productName}</p>
              {item.personalization && (
                <p className="mt-1 text-xs text-gray-500">Personalização: {item.personalization}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">{item.quantity} x {formatPrice(item.unitPrice)}</p>
            </div>
            <p className="font-display font-bold">{formatPrice(item.total)}</p>
          </div>
        ))}
      </div>

      {order.address && (
        <div className="mt-6 rounded-2xl border border-gray-100 p-5">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-gold-dark">Endereço de Entrega</p>
          <p className="text-sm text-gray-600">
            {order.address.recipient} — {order.address.street}, {order.address.number} - {order.address.neighborhood},{" "}
            {order.address.city}/{order.address.state} - {order.address.zipCode}
          </p>
        </div>
      )}

      {order.customerNotes && (
        <div className="mt-4 rounded-2xl border border-gray-100 p-5">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-gold-dark">Observações</p>
          <p className="text-sm text-gray-600">{order.customerNotes}</p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-gray-100 p-5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Desconto {order.couponCode && `(${order.couponCode})`}</span>
            <span>-{formatPrice(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-gray-100 pt-2 font-display text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
