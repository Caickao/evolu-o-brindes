import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const schema = z
  .object({
    name: z.string().min(2),
    group: z.string().min(2),
    description: z.string(),
    icon: z.string().min(1),
    order: z.number().int().nonnegative(),
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

  const { name, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }

  const category = await prisma.category.update({ where: { id }, data });

  revalidatePath("/", "layout");

  return NextResponse.json({ category });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await params;

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      {
        error: `Não é possível excluir: ${productCount} produto(s) ainda usam esta categoria. Mova ou exclua esses produtos primeiro.`,
      },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } }).catch(() => null);

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
