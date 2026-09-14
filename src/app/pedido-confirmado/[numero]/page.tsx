import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatDate } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";

export default async function OrderConfirmedPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { number: numero },
    include: { items: true, address: true },
  });

  if (!order || (order.userId !== session.user.id && session.user.role !== "ADMIN")) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Olá! Acabei de finalizar o pedido ${order.number} no site, no valor de ${formatPrice(order.total)}. Gostaria de confirmar os detalhes da personalização.`
  );

  return (
    <div className="container-page flex flex-col items-center py-16 md:py-24">
      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">Pedido Recebido!</h1>
      <p className="mt-2 max-w-md text-center text-sm text-gray-500">
        Obrigado pela sua compra. Nosso time entrará em contato para confirmar os detalhes de
        personalização e produção do seu pedido.
      </p>

      <div className="mt-10 w-full max-w-lg rounded-2xl border border-gray-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-bold">Pedido #{order.number}</p>
          <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-bold uppercase text-brand-gold-dark">
            {order.status.replace("_", " ")}
          </span>
        </div>
        <p className="mb-4 text-xs text-gray-400">Realizado em {formatDate(order.createdAt)}</p>

        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600">
              <span>{item.quantity}x {item.productName}</span>
              <span>{formatPrice(item.total)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-display text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          href={`https://wa.me/${CONTACT.whatsapp}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Confirmar pelo WhatsApp
        </Button>
        <Button href="/conta/pedidos" variant="outline">Ver Meus Pedidos</Button>
      </div>

      <Link href="/produtos" className="mt-6 text-xs font-semibold text-gray-500 hover:text-brand-black">
        Continuar comprando
      </Link>
    </div>
  );
}
