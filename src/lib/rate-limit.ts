import { prisma } from "@/lib/prisma";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Segundos até a janela atual liberar novamente. */
  retryAfterSeconds: number;
};

/**
 * Limitador de taxa por janela fixa, contado no Postgres (sem depender de Redis).
 * Suficiente para o volume atual do site; se o tráfego crescer muito, migrar para
 * um serviço dedicado (ex: Upstash Redis) evita essa consulta extra por requisição.
 *
 * @param key identificador único do limite (ex: `register:203.0.113.4`)
 * @param limit quantas requisições permitir dentro da janela
 * @param windowSeconds duração da janela, em segundos
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = new Date();
  const windowMs = windowSeconds * 1000;

  const existing = await prisma.rateLimitEntry.findUnique({ where: { key } });

  const windowExpired =
    !existing || now.getTime() - existing.windowStart.getTime() >= windowMs;

  if (windowExpired) {
    await prisma.rateLimitEntry.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: windowSeconds };
  }

  const retryAfterSeconds = Math.ceil(
    (existing.windowStart.getTime() + windowMs - now.getTime()) / 1000
  );

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  await prisma.rateLimitEntry.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return {
    allowed: true,
    remaining: limit - existing.count - 1,
    retryAfterSeconds,
  };
}

/** Extrai o IP do cliente a partir dos headers padrão que a Vercel injeta. */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return Response.json(
    { error: "Muitas tentativas. Tente novamente em alguns instantes." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
