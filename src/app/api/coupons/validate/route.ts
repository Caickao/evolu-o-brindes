import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Informe um cupom" }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code: String(code).toUpperCase() } });

  if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) {
    return NextResponse.json({ error: "Cupom inválido ou expirado" }, { status: 404 });
  }

  return NextResponse.json({ code: coupon.code, percentOff: coupon.percentOff });
}
