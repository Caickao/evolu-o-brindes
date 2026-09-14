import type { Metadata } from "next";
import { Award, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "Conheça a história, missão e valores da Evolução Brindes & Personalizados.",
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Exclusividade",
    description: "Cada projeto é único, desenvolvido sob medida para representar a identidade do nosso cliente.",
  },
  {
    icon: ShieldCheck,
    title: "Qualidade",
    description: "Selecionamos materiais e processos que garantem durabilidade e acabamento impecável.",
  },
  {
    icon: HeartHandshake,
    title: "Compromisso",
    description: "Acompanhamos cada pedido do orçamento à entrega, com atenção total aos detalhes.",
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Buscamos superar expectativas em cada peça que sai da nossa produção.",
  },
];

export default function SobrePage() {
  return (
    <div>
      <section className="bg-brand-black py-20 text-center">
        <div className="container-page">
          <SectionHeading
            eyebrow="Nossa História"
            title="Evolução Brindes & Personalizados"
            description="Nascemos da paixão por transformar identidade e propósito em produtos físicos memoráveis."
            light
          />
        </div>
      </section>

      <section className="container-page grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-bold">Nossa Trajetória</h2>
          <p className="leading-relaxed text-gray-600">
            A Evolução Brindes & Personalizados nasceu do desejo de oferecer para clubes de Desbravadores,
            igrejas, escolas e empresas produtos personalizados que realmente representassem a identidade de
            cada grupo. O que começou com pequenos lotes de pins e distintivos se tornou uma operação completa
            de personalização premium, atendendo clientes em todo o Brasil.
          </p>
          <p className="leading-relaxed text-gray-600">
            Hoje, unimos tradição artesanal e processos modernos de produção para entregar peças que vão além
            do brinde: elas carregam significado, pertencimento e orgulho para quem as recebe.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl bg-brand-ivory p-8">
          <div>
            <p className="font-display text-4xl font-extrabold text-brand-gold-dark">+10.000</p>
            <p className="text-sm text-gray-500">Produtos personalizados entregues</p>
          </div>
          <div className="gold-divider" />
          <div>
            <p className="font-display text-4xl font-extrabold text-brand-gold-dark">+300</p>
            <p className="text-sm text-gray-500">Clubes, igrejas e empresas atendidas</p>
          </div>
          <div className="gold-divider" />
          <div>
            <p className="font-display text-4xl font-extrabold text-brand-gold-dark">100%</p>
            <p className="text-sm text-gray-500">Personalização sob medida</p>
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory py-16 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Missão & Valores" title="O que nos move" className="mb-12" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-black text-brand-gold">
                  <v.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-bold">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col items-center gap-5 py-16 text-center md:py-24">
        <h2 className="max-w-xl font-display text-3xl font-bold md:text-4xl">
          Pronto para elevar a identidade do seu clube ou empresa?
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/produtos" size="lg">Ver Produtos</Button>
          <Button
            href={`https://wa.me/${CONTACT.whatsapp}`}
            variant="outline"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com a Equipe
          </Button>
        </div>
      </section>
    </div>
  );
}
