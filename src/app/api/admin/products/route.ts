import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional().nullable(),
  categoryId: z.string(),
  icon: z.string().min(1),
  photos: z.array(z.string().url()).default([]),
  stock: z.number().int().nonnegative().default(100),
  minQuantity: z.number().int().positive().default(1),
  customizable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados inválidos" }, { status: 400 });
  }

  const { icon, photos, ...data } = parsed.data;

  const product = await prisma.product.create({
    data: {
      ...data,
      slug: slugify(data.name),
      images: JSON.stringify([icon]),
      photos: JSON.stringify(photos),
    },
  });

  return NextResponse.json({ product });
}
