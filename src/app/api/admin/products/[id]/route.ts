import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// Mesmos campos aceitos na criação (POST /api/admin/products), todos opcionais
// aqui porque um PATCH pode atualizar só parte do produto. Antes esta rota
// aceitava o corpo da requisição inteiro sem checagem — qualquer campo extra
// era escrito direto no banco.
const schema = z
  .object({
    name: z.string().min(2),
    description: z.string().min(5),
    shortDescription: z.string(),
    price: z.number().positive(),
    compareAtPrice: z.number().positive().nullable(),
    categoryId: z.string(),
    icon: z.string().min(1),
    photos: z.array(z.string().url()),
    stock: z.number().int().nonnegative(),
    minQuantity: z.number().int().positive(),
    customizable: z.boolean(),
    isFeatured: z.boolean(),
    isNew: z.boolean(),
    isBestSeller: z.boolean(),
  })
  .partial();

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados inválidos" }, { status: 400 });
  }

  const { icon, photos, name, ...rest } = parsed.data;

  const data: Record<string, unknown> = { ...rest };
  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }
  if (icon) {
    data.images = JSON.stringify([icon]);
  }
  if (photos) {
    data.photos = JSON.stringify(photos);
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
