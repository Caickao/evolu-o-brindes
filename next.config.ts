import type { NextConfig } from "next";

// Política deliberadamente conservadora: protege contra os ataques mais comuns
// (clickjacking, sniffing de tipo de conteúdo, carregamento de scripts/estilos
// de origens arbitrárias) sem exigir nonces por requisição, o que quebraria o
// hidratação do Next.js sem uma refatoração maior. Apertar para uma CSP baseada
// em nonce é uma tarefa de segurança separada, não deste pacote de correções.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // Enquanto o upload de arquivo não está implementado (ver Correção 3), o admin
    // cadastra fotos colando a URL de onde já estiverem hospedadas — por isso o
    // padrão libera qualquer host HTTPS. Quando um provedor de storage for definido
    // (Vercel Blob é o mais direto, já que o projeto está na Vercel), trocar por um
    // remotePattern específico daquele host e remover o coringa abaixo.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
