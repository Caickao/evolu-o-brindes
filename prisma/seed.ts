import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORY_GROUPS } from "../src/lib/constants";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

type SeedProduct = {
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  minQuantity?: number;
};

const PRODUCTS_BY_CATEGORY: Record<string, SeedProduct[]> = {
  arganel: [
    {
      name: "Arganel Premium Metálico",
      price: 12.9,
      description:
        "Arganel personalizado em metal de alta durabilidade, com gravação exclusiva do brasão do seu clube. Acabamento premium banhado e resistente ao uso diário.",
      shortDescription: "Arganel em metal com gravação exclusiva.",
      isBestSeller: true,
      minQuantity: 10,
    },
    {
      name: "Arganel Dourado Edição Especial",
      price: 15.9,
      description:
        "Versão especial do arganel com detalhes dourados, ideal para diretorias e ocasiões comemorativas do clube de desbravadores.",
      shortDescription: "Edição especial com acabamento dourado.",
      minQuantity: 10,
    },
  ],
  pins: [
    {
      name: "Pin Esmaltado Personalizado",
      price: 8.5,
      description:
        "Pin em metal esmaltado, totalmente personalizável com a logo e cores do seu clube ou evento. Ótimo para trocas e distribuição em acampamentos.",
      shortDescription: "Pin esmaltado com cores exclusivas.",
      isBestSeller: true,
      minQuantity: 20,
    },
    {
      name: "Pin Comemorativo de Evento",
      price: 9.9,
      description:
        "Pin exclusivo para eventos e congressos, com numeração limitada e acabamento em relevo metálico.",
      shortDescription: "Peça de coleção para eventos.",
      isNew: true,
      minQuantity: 20,
    },
  ],
  "lencos-personalizados": [
    {
      name: "Lenço Bordado Tradicional",
      price: 24.9,
      description:
        "Lenço 100% personalizável, bordado com brasão do clube e acabamento reforçado nas bordas. Tecido de alta qualidade que resiste ao uso intenso em acampamentos.",
      shortDescription: "Lenço bordado com brasão do clube.",
      isBestSeller: true,
      minQuantity: 15,
    },
    {
      name: "Lenço Estampado Full Print",
      price: 22.9,
      description:
        "Estampa total personalizada, cores vibrantes e resistentes à lavagem. Ideal para eventos e identificação de unidades.",
      shortDescription: "Estampa total em cores vibrantes.",
      minQuantity: 15,
    },
  ],
  distintivos: [
    {
      name: "Distintivo de Especialidade",
      price: 6.9,
      description:
        "Distintivo bordado para especialidades, seguindo o padrão oficial com qualidade de acabamento superior.",
      shortDescription: "Bordado padrão para especialidades.",
      minQuantity: 25,
    },
    {
      name: "Distintivo de Classe Premium",
      price: 7.9,
      description:
        "Distintivo de classe com bordado em alta definição e cores fiéis ao padrão exigido.",
      shortDescription: "Bordado de alta definição.",
      isBestSeller: true,
      minQuantity: 25,
    },
  ],
  trunfos: [
    {
      name: "Kit Trunfos do Clube",
      price: 34.9,
      description:
        "Baralho de trunfos totalmente personalizado com fotos e informações do seu clube. Impressão em alta resolução e acabamento emborrachado.",
      shortDescription: "Baralho personalizado do seu clube.",
      isNew: true,
      minQuantity: 5,
    },
  ],
  bottons: [
    {
      name: "Botton Redondo Personalizado",
      price: 4.9,
      description:
        "Botton personalizado em diversos tamanhos, ideal para brindes de eventos, campanhas e identificação de equipes.",
      shortDescription: "Botton redondo, leve e resistente.",
      minQuantity: 50,
    },
    {
      name: "Botton Formato Especial",
      price: 5.9,
      description:
        "Botton com recorte especial seguindo o formato da sua logo ou mascote, com acabamento fosco ou brilhante.",
      shortDescription: "Recorte especial sob medida.",
      minQuantity: 50,
    },
  ],
  brasoes: [
    {
      name: "Brasão Bordado Alta Definição",
      price: 18.9,
      description:
        "Brasão bordado com máxima fidelidade de cores e detalhes, ideal para uniformes e lenços oficiais do clube.",
      shortDescription: "Bordado fiel aos detalhes do clube.",
      isBestSeller: true,
      minQuantity: 10,
    },
  ],
  "trofeus-personalizados": [
    {
      name: "Troféu Prestígio Dourado",
      price: 129.9,
      compareAtPrice: 159.9,
      description:
        "Troféu premium com base em MDF e corpo metalizado dourado, placa de identificação personalizada a laser. Perfeito para premiações de destaque.",
      shortDescription: "Troféu premium com placa personalizada.",
      isFeatured: true,
      isBestSeller: true,
      minQuantity: 1,
    },
    {
      name: "Troféu Excelência Cristal",
      price: 149.9,
      description:
        "Troféu em cristal ótico com gravação a laser, transmitindo sofisticação para premiações institucionais.",
      shortDescription: "Cristal ótico com gravação a laser.",
      isFeatured: true,
      minQuantity: 1,
    },
  ],
  medalhas: [
    {
      name: "Medalha Personalizada Redonda",
      price: 19.9,
      description:
        "Medalha em metal com fita personalizada nas cores do seu evento, gravação exclusiva e acabamento resistente.",
      shortDescription: "Metal resistente com fita personalizada.",
      isBestSeller: true,
      minQuantity: 10,
    },
    {
      name: "Medalha Honra ao Mérito",
      price: 22.9,
      description:
        "Medalha especial para homenagens e reconhecimentos, com detalhes em relevo e acabamento dourado ou prateado.",
      shortDescription: "Ideal para homenagens especiais.",
      minQuantity: 10,
    },
  ],
  "placas-comemorativas": [
    {
      name: "Placa Comemorativa em MDF",
      price: 59.9,
      description:
        "Placa personalizada em MDF de alta densidade com impressão UV, ideal para homenagens e datas comemorativas.",
      shortDescription: "Impressão UV de alta durabilidade.",
      minQuantity: 1,
    },
    {
      name: "Placa Acrílico Premium",
      price: 89.9,
      description:
        "Placa em acrílico transparente com gravação a laser, acabamento sofisticado para eventos institucionais.",
      shortDescription: "Acrílico com gravação a laser.",
      isNew: true,
      minQuantity: 1,
    },
  ],
  homenagens: [
    {
      name: "Kit Homenagem Especial",
      price: 79.9,
      description:
        "Kit completo de homenagem com placa, moldura e cartão personalizado, perfeito para reconhecer voluntários e líderes.",
      shortDescription: "Kit completo para reconhecimentos.",
      minQuantity: 1,
    },
  ],
  canecas: [
    {
      name: "Caneca de Porcelana Personalizada",
      price: 34.9,
      description:
        "Caneca de porcelana 325ml com impressão personalizada de alta definição, resistente à lavagem em máquina.",
      shortDescription: "Porcelana 325ml com impressão HD.",
      isBestSeller: true,
      minQuantity: 1,
    },
    {
      name: "Caneca Mágica Térmica",
      price: 44.9,
      description:
        "Caneca térmica que revela a estampa personalizada com o calor da bebida. Um brinde surpreendente e exclusivo.",
      shortDescription: "Estampa revelada pelo calor.",
      isNew: true,
      minQuantity: 1,
    },
  ],
  chaveiros: [
    {
      name: "Chaveiro Acrílico Personalizado",
      price: 14.9,
      description:
        "Chaveiro em acrílico premium com corte a laser no formato do seu logo, disponível em diversas cores.",
      shortDescription: "Corte a laser em acrílico premium.",
      minQuantity: 5,
    },
    {
      name: "Chaveiro Metal Gravado",
      price: 19.9,
      description:
        "Chaveiro em metal com gravação personalizada, acabamento resistente e sofisticado.",
      shortDescription: "Metal com gravação sofisticada.",
      isBestSeller: true,
      minQuantity: 5,
    },
  ],
  camisas: [
    {
      name: "Camisa Personalizada do Clube",
      price: 69.9,
      description:
        "Camisa 100% algodão com estampa personalizada do seu clube, disponível em diversos tamanhos e cores.",
      shortDescription: "100% algodão com estampa exclusiva.",
      isBestSeller: true,
      minQuantity: 10,
    },
    {
      name: "Camisa Dry Fit Eventos",
      price: 79.9,
      description:
        "Camisa em tecido dry fit, ideal para atividades ao ar livre e acampamentos, com estampa personalizada.",
      shortDescription: "Tecido dry fit para atividades externas.",
      isNew: true,
      minQuantity: 10,
    },
  ],
  "kits-personalizados": [
    {
      name: "Kit Boas-Vindas Personalizado",
      price: 99.9,
      description:
        "Kit completo com caneca, chaveiro e caderno personalizados, ideal para receber novos membros do clube.",
      shortDescription: "Kit completo para novos membros.",
      isFeatured: true,
      minQuantity: 1,
    },
  ],
  "brindes-corporativos": [
    {
      name: "Kit Brinde Corporativo Premium",
      price: 119.9,
      description:
        "Kit corporativo com itens de alta qualidade personalizados com a marca da sua empresa, ideal para ações de marketing.",
      shortDescription: "Kit premium para ações corporativas.",
      minQuantity: 1,
    },
  ],
  "kits-para-eventos": [
    {
      name: "Kit Congresso Completo",
      price: 149.9,
      description:
        "Kit completo para congressos e acampamentos com crachá, cordão, caneca e lembrança personalizados.",
      shortDescription: "Kit completo para congressos.",
      isFeatured: true,
      minQuantity: 1,
    },
  ],
  lembrancas: [
    {
      name: "Lembrança Personalizada de Evento",
      price: 12.9,
      description:
        "Lembrança exclusiva personalizada com o tema do seu evento, ideal para distribuir aos participantes.",
      shortDescription: "Exclusiva para os participantes do evento.",
      minQuantity: 30,
    },
  ],
  "identificacao-de-equipes": [
    {
      name: "Crachá de Identificação Personalizado",
      price: 9.9,
      description:
        "Crachá resistente com cordão personalizado, ideal para identificar staff e equipes durante eventos.",
      shortDescription: "Crachá resistente com cordão personalizado.",
      minQuantity: 20,
    },
  ],
};

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany();

  let order = 0;
  for (const group of CATEGORY_GROUPS) {
    for (const cat of group.categories) {
      const category = await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          group: group.group,
          order: order++,
        },
      });

      const products = PRODUCTS_BY_CATEGORY[cat.slug] || [];
      for (const p of products) {
        await prisma.product.create({
          data: {
            name: p.name,
            slug: slugify(p.name),
            description: p.description,
            shortDescription: p.shortDescription,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            images: JSON.stringify([cat.icon]),
            categoryId: category.id,
            isFeatured: !!p.isFeatured,
            isNew: !!p.isNew,
            isBestSeller: !!p.isBestSeller,
            minQuantity: p.minQuantity || 1,
            rating: 4.6 + Math.random() * 0.4,
            reviewsCount: Math.floor(5 + Math.random() * 60),
          },
        });
      }
    }
  }

  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      name: "Administrador Evolução",
      email: "admin@evolucaobrindes.com.br",
      phone: "11999999999",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Cliente Demonstração",
      email: "cliente@exemplo.com",
      phone: "11988887777",
      passwordHash,
      role: "CUSTOMER",
      addresses: {
        create: [
          {
            label: "Casa",
            recipient: "Cliente Demonstração",
            street: "Rua das Palmeiras",
            number: "120",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP",
            zipCode: "01000-000",
            isDefault: true,
          },
        ],
      },
    },
  });

  await prisma.coupon.create({
    data: {
      code: "BEMVINDO10",
      percentOff: 10,
      active: true,
    },
  });

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
