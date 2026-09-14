import type { CategoryGroup } from "./types";

export const SITE_NAME = "Evolução Brindes & Personalizados";
export const SITE_DESCRIPTION =
  "Produtos personalizados premium para Desbravadores, clubes, eventos e organizações: pins, distintivos, troféus, medalhas, canecas, chaveiros e muito mais.";

export const CONTACT = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999",
  email: "contato@evolucaobrindes.com.br",
  instagram: "https://www.instagram.com/evolucaobrindes",
  address: "Rua das Palmeiras, 120 - Centro, São Paulo - SP",
  hours: "Segunda a Sexta, 9h às 18h | Sábado, 9h às 13h",
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    group: "Desbravadores",
    categories: [
      { name: "Arganel", slug: "arganel", icon: "CircleDot", description: "Arganéis personalizados com acabamento premium." },
      { name: "Pins", slug: "pins", icon: "Pin", description: "Pins esmaltados para clubes e eventos." },
      { name: "Lenços Personalizados", slug: "lencos-personalizados", icon: "Flag", description: "Lenços bordados e estampados sob medida." },
      { name: "Distintivos", slug: "distintivos", icon: "ShieldCheck", description: "Distintivos de especialidades e classes." },
      { name: "Trunfos", slug: "trunfos", icon: "Layers", description: "Trunfos personalizados para o seu clube." },
      { name: "Bottons", slug: "bottons", icon: "Disc", description: "Bottons personalizados em diversos formatos." },
      { name: "Brasões", slug: "brasoes", icon: "Shield", description: "Brasões bordados de alta definição." },
    ],
  },
  {
    group: "Troféus e Premiações",
    categories: [
      { name: "Troféus Personalizados", slug: "trofeus-personalizados", icon: "Trophy", description: "Troféus exclusivos para premiações e eventos." },
      { name: "Medalhas", slug: "medalhas", icon: "Medal", description: "Medalhas personalizadas em metal de alta qualidade." },
      { name: "Placas Comemorativas", slug: "placas-comemorativas", icon: "Award", description: "Placas em MDF, acrílico e metal." },
      { name: "Homenagens", slug: "homenagens", icon: "HeartHandshake", description: "Homenagens especiais para datas marcantes." },
    ],
  },
  {
    group: "Personalizados",
    categories: [
      { name: "Canecas", slug: "canecas", icon: "Coffee", description: "Canecas personalizadas de cerâmica e polímero." },
      { name: "Chaveiros", slug: "chaveiros", icon: "Key", description: "Chaveiros personalizados em acrílico e metal." },
      { name: "Camisas", slug: "camisas", icon: "Shirt", description: "Camisas personalizadas para clubes e equipes." },
      { name: "Kits Personalizados", slug: "kits-personalizados", icon: "PackageOpen", description: "Kits completos personalizados." },
      { name: "Brindes Corporativos", slug: "brindes-corporativos", icon: "Gift", description: "Brindes para empresas e ações de marketing." },
    ],
  },
  {
    group: "Eventos",
    categories: [
      { name: "Kits para Eventos", slug: "kits-para-eventos", icon: "PartyPopper", description: "Kits completos para congressos e acampamentos." },
      { name: "Lembranças", slug: "lembrancas", icon: "Sparkles", description: "Lembranças personalizadas para participantes." },
      { name: "Identificação de Equipes", slug: "identificacao-de-equipes", icon: "Users", description: "Crachás e identificações para equipes e staff." },
    ],
  },
];

export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap((g) => g.categories);

export const BENEFITS = [
  {
    icon: "Sparkles",
    title: "Personalização Exclusiva",
    description: "Cada produto é desenvolvido sob medida para o seu clube, evento ou empresa.",
  },
  {
    icon: "ShieldCheck",
    title: "Qualidade Premium",
    description: "Materiais selecionados e acabamento impecável em cada detalhe.",
  },
  {
    icon: "Truck",
    title: "Entrega para Todo o Brasil",
    description: "Enviamos com segurança para qualquer região do país.",
  },
  {
    icon: "HeartHandshake",
    title: "Atendimento Personalizado",
    description: "Nossa equipe acompanha seu pedido do orçamento à entrega.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Pr. Marcos Andrade",
    role: "Diretor de Clube de Desbravadores",
    quote:
      "A Evolução Brindes entregou os distintivos e lenços do nosso acampamento com uma qualidade impressionante. Os desbravadores amaram!",
  },
  {
    name: "Camila Ferreira",
    role: "Coordenadora de Eventos",
    quote:
      "Profissionalismo do início ao fim. Os kits personalizados chegaram antes do prazo e com um acabamento premium.",
  },
  {
    name: "João Vitor Souza",
    role: "Diretor Regional",
    quote:
      "Já são três anos comprando troféus e medalhas para nossas premiações anuais. Sempre impecáveis.",
  },
];
