# Evolução Brindes & Personalizados

E-commerce premium para produtos personalizados voltados a Desbravadores, clubes, igrejas, eventos e empresas. Construído com Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma e NextAuth.

## Stack

- **Frontend:** Next.js 16 (App Router, Server Components), React 19, TypeScript, Tailwind CSS v4
- **Estado do carrinho:** Zustand (persistido em localStorage)
- **Backend:** API Routes do Next.js (REST)
- **Banco de dados:** Prisma ORM + PostgreSQL (recomendado: [Neon](https://neon.tech), free tier, integra em 1 clique com a Vercel)
- **Autenticação:** NextAuth v5 (Credentials + JWT), senhas com bcrypt
- **Ícones:** lucide-react

## Primeiros passos

1. Crie um banco Postgres gratuito em [neon.tech](https://neon.tech) (ou use qualquer outro Postgres) e copie a connection string.
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL` com essa connection string.
3. Rode:

```bash
npm install
npm run db:push     # cria as tabelas a partir do schema
npm run db:seed     # popula categorias, produtos e usuários de demonstração
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Contas de demonstração

| Perfil    | Email                          | Senha    |
|-----------|---------------------------------|----------|
| Cliente   | cliente@exemplo.com             | 123456   |
| Admin     | admin@evolucaobrindes.com.br    | 123456   |

Cupom de desconto de teste: **BEMVINDO10** (10% off).

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — inicia o build de produção
- `npm run lint` — ESLint
- `npm run db:generate` — gera o Prisma Client
- `npm run db:push` — sincroniza o schema com o banco
- `npm run db:seed` — popula dados de exemplo
- `npm run db:reset` — **destrutivo**: recria o banco do zero e roda o seed novamente

## Estrutura do projeto

```
prisma/
  schema.prisma       # modelos: User, Address, Category, Product, Order, OrderItem, Favorite, Coupon
  seed.ts              # dados de demonstração (categorias, produtos, usuários, cupom)
src/
  app/                 # rotas (App Router)
    admin/             # painel administrativo (produtos, pedidos, dashboard)
    api/               # rotas de API (auth, register, orders, favorites, addresses, admin/*)
    conta/             # área do cliente (dados, pedidos, favoritos, endereços)
    produto/[slug]/    # página de produto
    produtos/          # catálogo com filtros por categoria, grupo e busca
    carrinho/          # carrinho de compras
    checkout/          # finalização de pedido
  components/          # componentes reutilizáveis (layout, produto, conta, admin, ui)
  lib/                 # auth, prisma client, dados, constantes, utils
  store/               # estado global (carrinho, toasts) via Zustand
  middleware.ts / proxy.ts  # proteção de rotas (/conta, /checkout, /admin)
```

## Categorias e produtos

As categorias seguem a estrutura solicitada (Desbravadores, Troféus e Premiações, Personalizados, Eventos) e estão centralizadas em `src/lib/constants.ts`. Os produtos usam ícones (lucide-react) como identidade visual no lugar de fotos reais — basta trocar pelo componente `ProductImage` por `<img>`/`next/image` quando houver fotos reais dos produtos.

## Logo

A logomarca em `public/logo.svg` e `public/logo-mark.svg` (favicon) foi recriada em SVG a partir da referência visual enviada (chevrons dourado/preto + "EVOLUÇÃO"). Ao receber o arquivo oficial da marca, basta substituir esses dois arquivos SVG mantendo o mesmo nome — nenhum outro ajuste é necessário.

## Painel administrativo

Acessível em `/admin` apenas para usuários com `role = ADMIN`. Permite:

- Dashboard com métricas (produtos, pedidos, clientes, receita)
- CRUD de produtos (criar, editar, excluir)
- Gestão de pedidos com atualização de status (Recebido → Em Produção → Enviado → Finalizado/Cancelado)

## Fluxo de pedido

O checkout cria o pedido no banco de dados (com status `RECEBIDO`) e direciona o cliente para confirmar os detalhes de personalização via WhatsApp — modelo comum para negócios de brindes personalizados sob encomenda, sem gateway de pagamento integrado nesta versão.

## Publicando online (GitHub + Vercel + Neon)

Passo a passo para gerar um link público que o cliente possa acessar e testar de verdade (cadastro, login, carrinho, pedidos, painel admin):

### 1. Banco de dados (Neon)

1. Crie uma conta gratuita em [neon.tech](https://neon.tech) e um novo projeto.
2. Copie a **connection string** (algo como `postgresql://user:senha@ep-xxxx.neon.tech/neondb?sslmode=require`).
3. Guarde essa string — ela será usada tanto localmente (`.env`) quanto na Vercel.

### 2. GitHub

1. Crie um repositório vazio em [github.com/new](https://github.com/new) (sem README/gitignore, para não conflitar).
2. Envie o código:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 3. Vercel

1. Acesse [vercel.com/new](https://vercel.com/new), faça login com sua conta GitHub e importe o repositório.
2. Em **Environment Variables**, adicione:
   - `DATABASE_URL` — a connection string do Neon
   - `AUTH_SECRET` — gere um valor forte com `openssl rand -base64 32` (ou qualquer string aleatória longa)
   - `NEXT_PUBLIC_SITE_URL` — a URL que a Vercel vai gerar (pode ajustar depois do primeiro deploy, ex: `https://seu-projeto.vercel.app`)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — número de WhatsApp real da empresa (só dígitos, com DDI, ex: `5511999999999`)
3. Clique em **Deploy**.
4. Após o primeiro deploy, rode uma única vez (com o `DATABASE_URL` do Neon no `.env` local) para criar as tabelas e os dados de exemplo no banco de produção:

```bash
npm run db:push
npm run db:seed
```

5. Pronto — a Vercel já entrega um link público (`https://seu-projeto.vercel.app`) pronto para enviar ao cliente. A cada novo `git push` no GitHub, a Vercel publica uma nova versão automaticamente.

### Antes de considerar "produção final"

1. Trocar as contas de demonstração e o cupom `BEMVINDO10` por dados reais (ou apagar via `/admin`).
2. Substituir a logo placeholder pelo arquivo oficial da marca (`public/logo.svg` e `public/logo-mark.svg`).
3. Integrar um gateway de pagamento, se o checkout evoluir para cobrança automática.
