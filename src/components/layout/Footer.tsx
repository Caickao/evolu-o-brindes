import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { CATEGORY_GROUPS, CONTACT, SITE_DESCRIPTION } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-brand-black text-gray-300">
      <div className="container-page grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <img
            src="/logo.svg"
            alt="Evolução Brindes & Personalizados"
            width={220}
            height={56}
            className="h-11 w-auto brightness-0 invert"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">{SITE_DESCRIPTION}</p>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-brand-gold transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-brand-black"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
        </div>

        <div>
          <p className="font-display mb-4 text-sm font-bold uppercase tracking-wide text-white">Institucional</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link href="/sobre" className="hover:text-brand-gold">Sobre Nós</Link></li>
            <li><Link href="/produtos" className="hover:text-brand-gold">Produtos</Link></li>
            <li><Link href="/contato" className="hover:text-brand-gold">Contato</Link></li>
            <li><Link href="/login" className="hover:text-brand-gold">Minha Conta</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display mb-4 text-sm font-bold uppercase tracking-wide text-white">Categorias</p>
          <ul className="flex flex-col gap-3 text-sm">
            {CATEGORY_GROUPS.map((g) => (
              <li key={g.group}>
                <Link href={`/produtos?grupo=${encodeURIComponent(g.group)}`} className="hover:text-brand-gold">
                  {g.group}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display mb-4 text-sm font-bold uppercase tracking-wide text-white">Contato</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" /> {CONTACT.address}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <a href={`https://wa.me/${CONTACT.whatsapp}`} className="hover:text-brand-gold">
                WhatsApp
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-brand-gold">{CONTACT.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" /> {CONTACT.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="gold-divider" />

      <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-gray-500 md:flex-row">
        <p>© {new Date().getFullYear()} Evolução Brindes & Personalizados. Todos os direitos reservados.</p>
        <p>Feito com excelência para clubes, eventos e empresas.</p>
      </div>
    </footer>
  );
}
