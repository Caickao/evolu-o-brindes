import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await rateLimit(`register:${ip}`, 5, 60 * 60);
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Dados inválidos" },
      { status: 400 }
    );
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, phone, passwordHash },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
