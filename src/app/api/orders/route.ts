import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const schema = z.object({
  addressId: z.string().optional(),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        personalization: z.string().optional(),
      })
    )
    .min(1, "O carrinho está vazio"),
});

class InsufficientStockError extends Error {
  constructor(public productName: string) {
    super(`Estoque insuficiente para "${productName}"`);
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Você precisa estar logado para finalizar o pedido" }, { status: 401 });
  }

  const limit = await rateLimit(`orders:${session.user.id}`, 10, 60 * 60);
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados inválidos" }, { status: 400 });
  }

  const { items, addressId, couponCode, customerNotes } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Um ou mais produtos não foram encontrados" }, { status: 400 });
  }

  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: "Cupom inválido ou expirado" }, { status: 400 });
    }
  }

  if (addressId) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id },
    });
    if (!address) {
      return NextResponse.json({ error: "Endereço inválido" }, { status: 400 });
    }
  }

  // Preço e totais são calculados com Prisma.Decimal (não `number`) para não
  // introduzir erro de arredondamento de ponto flutuante em valores monetários.
  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const quantity = Math.max(item.quantity, product.minQuantity);
    return {
      productId: product.id,
      productName: product.name,
      productImage: product.images,
      unitPrice: product.price,
      quantity,
      personalization: item.personalization,
      total: product.price.times(quantity),
    };
  });

  const subtotal = orderItemsData.reduce(
    (sum, i) => sum.plus(i.total),
    new Prisma.Decimal(0)
  );
  const discount = coupon ? subtotal.times(coupon.percentOff).dividedBy(100) : new Prisma.Decimal(0);
  const total = Prisma.Decimal.max(0, subtotal.minus(discount));

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Decremento condicional: só decrementa se ainda houver estoque suficiente
      // no momento exato da escrita. Evita vender mais do que existe quando dois
      // pedidos do mesmo produto chegam ao mesmo tempo.
      for (const item of orderItemsData) {
        const result = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw new InsufficientStockError(item.productName);
        }
      }

      return tx.order.create({
        data: {
          number: generateOrderNumber(),
          userId: session.user.id,
          addressId,
          couponCode: coupon?.code,
          customerNotes,
          subtotal,
          discount,
          total,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });
    });

    return NextResponse.json({ order });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
