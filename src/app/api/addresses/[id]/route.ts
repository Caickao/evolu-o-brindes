import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Mesmos campos aceitos em POST /api/addresses, todos opcionais aqui porque um
// PATCH pode atualizar só parte do endereço (ex: só marcar como padrão). Antes
// esta rota aceitava o corpo da requisição inteiro sem checagem nenhuma.
const schema = z
  .object({
    label: z.string().min(1),
    recipient: z.string().min(2),
    street: z.string().min(2),
    number: z.string().min(1),
    complement: z.string(),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(2).max(2),
    zipCode: z.string().min(8),
    isDefault: z.boolean(),
  })
  .partial();

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;
  await prisma.address.deleteMany({ where: { id, userId: session.user.id } });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados de endereço inválidos" }, { status: 400 });
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.updateMany({
    where: { id, userId: session.user.id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true });
}
