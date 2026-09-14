import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { icon, name, ...rest } = body;

  const data: Record<string, unknown> = { ...rest };
  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }
  if (icon) {
    data.images = JSON.stringify([icon]);
  }

  const product = await prisma.product.update({ where: { id }, data });

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ ok: true });
}
