import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await rateLimit(`contact:${ip}`, 5, 60 * 60);
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Preencha todos os campos obrigatórios" }, { status: 400 });
  }

  await prisma.contactMessage.create({ data: parsed.data });

  return NextResponse.json({ ok: true });
}
