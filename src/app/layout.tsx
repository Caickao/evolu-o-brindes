import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/Toaster";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getCategoryGroups } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// O layout raiz busca categorias do banco para o menu (header/rodapé). Páginas
// sem outra fonte de dado dinâmico (ex: /sobre, /login) seriam geradas de forma
// estática com esse valor "congelado" no build. O revalidate + o
// revalidatePath("/", "layout") chamado nas rotas de admin/categorias garantem
// que uma edição de categoria apareça em todo o site assim que salva, em vez
// de só no próximo deploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | Personalizados Premium para Desbravadores e Eventos`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "brindes personalizados",
    "desbravadores",
    "pins personalizados",
    "distintivos",
    "troféus personalizados",
    "medalhas personalizadas",
    "canecas personalizadas",
    "brindes corporativos",
  ],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/logo.svg", width: 860, height: 220, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categoryGroups = await getCategoryGroups();

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-brand-black">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <AuthProvider>
          <Header categoryGroups={categoryGroups} />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer categoryGroups={categoryGroups} />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
