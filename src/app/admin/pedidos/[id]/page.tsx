import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductImage } from "@/components/ui/ProductImage";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatDate, formatPrice } from "@/lib/utils";
import { parseProductIcon } from "@/lib/data";

export const metadata: Metadata = { title: "Detalhe do Pedido" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, address: true, items: true },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Pedido #{order.number}</h2>
          <p className="text-xs text-gray-400">Realizado em {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 shrink-0 text-brand-gold-dark" /> {order.user.name}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 shrink-0 text-brand-gold-dark" /> {order.user.email}
        </div>
        {order.user.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 shrink-0 text-brand-gold-dark" /> {order.user.phone}
          </div>
        )}
      </div>

      <p className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-gold-dark">
        Itens do Pedido (personalização para a produção)
      </p>
      <div className="flex flex-col gap-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-2xl border border-gray-100 p-4">
            <ProductImage
              icon={parseProductIcon(item.productImage)}
              name={item.productName}
              className="h-20 w-20 shrink-0 rounded-xl"
              iconClassName="h-8 w-8"
            />
            <div className="flex-1">
              <p className="font-display font-bold">{item.productName}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {item.quantity} x {formatPrice(item.unitPrice)}
              </p>
              {item.personalization ? (
                <div className="mt-2 rounded-lg bg-brand-gold/10 p-3 text-sm text-brand-black">
                  <span className="font-semibold uppercase text-[11px] tracking-wide text-brand-gold-dark">
                    Personalização:{" "}
                  </span>
                  {item.personalization}
                </div>
              ) : (
                <p className="mt-2 text-xs italic text-gray-400">Sem personalização informada.</p>
              )}
            </div>
            <p className="shrink-0 font-display font-bold">{formatPrice(item.total)}</p>
          </div>
        ))}
      </div>

      {order.address && (
        <div className="mt-6 rounded-2xl border border-gray-100 p-5">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-gold-dark">Endereço de Entrega</p>
          <p className="text-sm text-gray-600">
            {order.address.recipient} — {order.address.street}, {order.address.number} -{" "}
            {order.address.neighborhood}, {order.address.city}/{order.address.state} - {order.address.zipCode}
          </p>
        </div>
      )}

      {order.customerNotes && (
        <div className="mt-4 rounded-2xl border border-gray-100 p-5">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-gold-dark">Observações do Cliente</p>
          <p className="text-sm text-gray-600">{order.customerNotes}</p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-gray-100 p-5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {Number(order.discount) > 0 && (
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
