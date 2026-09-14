import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Evolução Brindes & Personalizados pelo WhatsApp, Instagram, email ou formulário.",
};

export default function ContatoPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading
        eyebrow="Fale Conosco"
        title="Vamos Criar Algo Especial Juntos"
        description="Estamos prontos para entender seu projeto e transformar em um produto personalizado premium."
        className="mb-12"
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-brand-gold/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-black text-brand-gold">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-bold">WhatsApp</p>
              <p className="text-sm text-gray-500">Atendimento rápido e direto</p>
            </div>
          </a>

          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-brand-gold/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-black text-brand-gold">
              <InstagramIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-bold">Instagram</p>
              <p className="text-sm text-gray-500">@evolucaobrindes</p>
            </div>
          </a>

          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-brand-gold/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-black text-brand-gold">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-bold">Email</p>
              <p className="text-sm text-gray-500">{CONTACT.email}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-black text-brand-gold">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-bold">Localização</p>
              <p className="text-sm text-gray-500">{CONTACT.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-black text-brand-gold">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-bold">Horário de Atendimento</p>
              <p className="text-sm text-gray-500">{CONTACT.hours}</p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
