# SaaS Admin

Painel administrativo SaaS construído com React, TypeScript, Vite, Tailwind CSS e Supabase. O projeto foi iniciado com uma base responsiva e preparada para operações multi-tenant, reunindo clientes, atendimento, notificações, assinaturas e integrações em uma mesma aplicação.

## Visão geral

A aplicação serve como ponto central de gestão operacional para produtos SaaS. Cada recurso pode ser associado a um tenant, permitindo separar dados, configurações, branding, permissões e integrações entre diferentes organizações.

A primeira tela apresenta a proposta do produto e os principais domínios disponíveis. O cliente Supabase já está preparado em `src/lib/supabase.ts` para que as próximas telas possam ler e gravar dados no banco conectado.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase JS
- PostCSS e Autoprefixer

## Estrutura do projeto

```text
.
├── index.html                 # HTML principal da aplicação
├── package.json               # Scripts e dependências
├── vite.config.ts             # Configuração do Vite
├── tailwind.config.js         # Tema e utilitários do Tailwind
├── postcss.config.js          # Pipeline de estilos
├── tsconfig.json              # Referências do TypeScript
├── tsconfig.app.json          # Configuração TypeScript do frontend
├── tsconfig.node.json         # Configuração TypeScript dos arquivos do Vite
├── .env.example               # Variáveis de ambiente necessárias
└── src
    ├── App.tsx                # Tela inicial da aplicação
    ├── index.css              # Estilos globais e tokens visuais
    ├── main.tsx               # Ponto de entrada do React
    └── lib
        └── supabase.ts         # Cliente Supabase compartilhado
```

## Como rodar

### Pré-requisitos

- Node.js 18 ou superior
- npm, pnpm ou yarn
- Projeto Supabase configurado

### Instalação

```bash
npm install
```

### Configuração do ambiente

Copie `.env.example` para `.env.local` e preencha as credenciais do projeto Supabase:

```bash
cp .env.example .env.local
```

As variáveis utilizadas são:

- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: chave pública anon do Supabase

### Desenvolvimento

```bash
npm run dev
```

O Vite exibirá a URL local da aplicação no terminal.

### Build de produção

```bash
npm run build
```

Para visualizar o build localmente:

```bash
npm run preview
```

### Verificação de tipos

```bash
npm run lint
```

## Principais funcionalidades

- Tela inicial responsiva para apresentação do painel.
- Base visual com tokens de cor, bordas, tipografia e componentes compatíveis com Tailwind CSS.
- Cliente Supabase centralizado e pronto para autenticação, leitura e gravação.
- Organização multi-tenant para separar dados por organização.
- Domínios preparados para clientes, tickets, mensagens, notificações, campanhas, pagamentos, assinaturas, integrações ERP e webhooks.
- Estrutura extensível para inclusão de rotas, componentes e fluxos autenticados.

## Estrutura de dados disponível

O schema público do Supabase possui as seguintes tabelas:

- `app_components`
- `app_configs`
- `audit_logs`
- `customer_devices`
- `customer_sessions`
- `customers`
- `erp_credentials`
- `erp_integrations`
- `maintenance`
- `notification_campaigns`
- `notification_deliveries`
- `notifications`
- `payments`
- `permissions`
- `roles`
- `saas_plans`
- `subscriptions`
- `tenant_branding`
- `tenant_features`
- `tenant_settings`
- `tenants`
- `ticket_messages`
- `tickets`
- `user_roles`
- `users`
- `webhook_deliveries`
- `webhooks`

As consultas forem implementadas, devem usar exatamente esses nomes de tabelas e colunas e sempre respeitar o `tenant_id` correspondente ao contexto da operação.

## Convenções para evolução

- Manter a interface responsiva e baseada nas classes do Tailwind.
- Reutilizar o cliente exportado por `src/lib/supabase.ts`.
- Usar as tabelas e colunas reais do schema, sem criar nomes alternativos no código.
- Manter credenciais somente em variáveis de ambiente e nunca versionar arquivos `.env.local`.
- Adicionar novas áreas em componentes e rotas pequenas, mantendo a responsabilidade de cada arquivo clara.
