# Evolução Brindes & Personalizados

E-commerce premium para produtos personalizados voltados a Desbravadores, clubes, igrejas, eventos e empresas. Construído com Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma e NextAuth.

## Stack

- **Frontend:** Next.js 16 (App Router, Server Components), React 19, TypeScript, Tailwind CSS v4
- **Estado do carrinho:** Zustand (persistido em localStorage)
- **Backend:** API Routes do Next.js (REST)
- **Banco de dados:** Prisma ORM + SQLite (arquivo local `prisma/dev.db`, fácil trocar para PostgreSQL/MySQL em produção)
- **Autenticação:** NextAuth v5 (Credentials + JWT), senhas com bcrypt
- **Ícones:** lucide-react

## Primeiros passos

```bash
npm install
npm run db:push     # cria o banco SQLite a partir do schema
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

## Produção

Antes de publicar:

1. Trocar `DATABASE_URL` para um banco gerenciado (PostgreSQL recomendado) e ajustar o `provider` em `prisma/schema.prisma`.
2. Gerar um novo `AUTH_SECRET` forte (`openssl rand -base64 32`).
3. Configurar `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_WHATSAPP_NUMBER` com os valores reais.
4. Substituir a logo placeholder pelo arquivo oficial da marca.
5. Integrar um gateway de pagamento, se o checkout evoluir para cobrança automática.
