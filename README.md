# SaaS Admin

Painel administrativo SaaS construído com React, TypeScript, Vite, Tailwind CSS e Supabase. O projeto fornece uma base responsiva para operações multi-tenant, reunindo clientes, atendimento, notificações, assinaturas, pagamentos, integrações e configurações em uma única aplicação.

## Visão geral

O SaaS Admin funciona como um ponto central de gestão operacional para produtos SaaS. Os dados são organizados por tenant, permitindo separar clientes, usuários, configurações, branding, permissões, integrações e registros operacionais entre diferentes organizações.

A aplicação utiliza o cliente Supabase compartilhado em `src/lib/supabase.ts`. As telas e fluxos podem usar esse cliente para autenticação, leitura e gravação nas tabelas do banco conectado, sempre respeitando o tenant relacionado à operação.

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
- Projeto Supabase configurado e acessível pela aplicação

### Instalação

```bash
npm install
```

### Configuração do ambiente

Copie `.env.example` para `.env.local` e informe as credenciais públicas do projeto Supabase:

```bash
cp .env.example .env.local
```

Variáveis utilizadas:

- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: chave pública anon do Supabase

O cliente é criado em `src/lib/supabase.ts` e deve ser reutilizado pelas funcionalidades do frontend.

### Desenvolvimento

```bash
npm run dev
```

O Vite disponibilizará a aplicação em uma URL local.

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

## Funcionalidades do MVP

A estrutura atual prepara os seguintes módulos para o MVP:

### Visão geral administrativa

- Tela inicial responsiva com os principais domínios do produto.
- Organização visual baseada em Tailwind CSS.
- Base preparada para expansão por rotas e componentes.
- Operação orientada a tenants, com separação dos dados por `tenant_id`.

### Clientes

- Cadastro e consulta de clientes.
- Armazenamento de nome, e-mail, documento e referência externa.
- Controle de ativação do cliente.
- Registro de dispositivos e sessões de clientes.

### Atendimento

- Criação e acompanhamento de tickets.
- Controle de status e prioridade.
- Associação opcional do ticket a um cliente.
- Registro de mensagens, autores internos e autores clientes.

### Notificações e campanhas

- Criação de notificações individuais.
- Controle de leitura por meio de `lida_em`.
- Organização de campanhas de comunicação.
- Registro das entregas por canal, campanha, notificação e cliente.
- Acompanhamento de status, data de entrega e erros de envio.

### Assinaturas e pagamentos

- Cadastro de planos SaaS.
- Controle de assinaturas por tenant.
- Associação entre assinaturas e planos.
- Registro de pagamentos, valores, moeda, status e referências externas.

### Integrações

- Cadastro de integrações com ERPs.
- Armazenamento do endpoint e do tipo da integração.
- Configuração de webhooks por evento.
- Registro das entregas de webhooks, tentativas, payloads e erros.
- Credenciais sensíveis representadas por `secret_ciphertext` e `encryption_key_version`.

### Configurações e personalização

- Branding por tenant, incluindo logotipo e cores.
- Configurações gerais em JSON usando `tenant_settings`.
- Habilitação de funcionalidades por tenant.
- Componentes e configurações adicionais da aplicação.
- Programação e acompanhamento de períodos de manutenção.

### Usuários, papéis e auditoria

- Cadastro de usuários vinculados a tenants.
- Associação de usuários a papéis por meio de `user_roles`.
- Cadastro de papéis e permissões.
- Registro de ações administrativas em `audit_logs`.

## Estrutura real do banco de dados

O schema público do Supabase possui as tabelas abaixo. Os nomes de tabelas e colunas devem ser usados exatamente como definidos aqui.

### Configuração da aplicação

#### `app_components`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `nome` text, obrigatório
- `tipo` text, obrigatório
- `configuracao` jsonb, obrigatório, padrão `{}`
- `ordem` integer, obrigatório, padrão `0`
- `ativo` boolean, obrigatório, padrão `true`

#### `app_configs`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `config_key` text, obrigatório
- `config_value` jsonb, obrigatório, padrão `{}`

#### `tenant_branding`

- `tenant_id` uuid, obrigatório, chave primária
- `logo_url` text
- `primary_color` text
- `secondary_color` text
- `atualizado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `tenant_features`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `feature_key` text, obrigatório
- `habilitado` boolean, obrigatório, padrão `false`

#### `tenant_settings`

- `tenant_id` uuid, obrigatório, chave primária
- `configuracoes` jsonb, obrigatório, padrão `{}`
- `atualizado_em` timestamp with time zone, obrigatório, padrão `now()`

### Tenants e controle de acesso

#### `tenants`

- `id` uuid, obrigatório
- `owner_id` uuid, obrigatório
- `nome` text, obrigatório
- `slug` text, obrigatório
- `ativo` boolean, obrigatório, padrão `true`
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `users`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `nome` text
- `email` text
- `ativo` boolean, obrigatório, padrão `true`
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `roles`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `nome` text, obrigatório
- `descricao` text

#### `permissions`

- `id` uuid, obrigatório
- `code` text, obrigatório
- `descricao` text

#### `user_roles`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `user_id` uuid, obrigatório
- `role_id` uuid, obrigatório

### Clientes e sessões

#### `customers`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `nome` text, obrigatório
- `email` text
- `documento` text
- `external_ref` text
- `ativo` boolean, obrigatório, padrão `true`
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `customer_devices`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `customer_id` uuid, obrigatório
- `device_token` text
- `plataforma` text
- `ultimo_acesso_em` timestamp with time zone
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `customer_sessions`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `customer_id` uuid, obrigatório
- `token_hash` text, obrigatório
- `expires_at` timestamp with time zone, obrigatório
- `revoked_at` timestamp with time zone
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

### Atendimento

#### `tickets`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `customer_id` uuid
- `assunto` text, obrigatório
- `descricao` text
- `status` text, obrigatório, padrão `open`
- `prioridade` text, obrigatório, padrão `normal`
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `ticket_messages`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `ticket_id` uuid, obrigatório
- `author_user_id` uuid
- `author_customer_id` uuid
- `mensagem` text, obrigatório
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

### Notificações

#### `notifications`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `customer_id` uuid
- `titulo` text, obrigatório
- `mensagem` text, obrigatório
- `lida_em` timestamp with time zone
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `notification_campaigns`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `nome` text, obrigatório
- `conteudo` jsonb, obrigatório, padrão `{}`
- `status` text, obrigatório, padrão `draft`
- `agendada_para` timestamp with time zone
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `notification_deliveries`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `campaign_id` uuid
- `notification_id` uuid
- `customer_id` uuid
- `canal` text, obrigatório
- `status` text, obrigatório
- `entregue_em` timestamp with time zone
- `erro` text

### Planos, assinaturas e pagamentos

#### `saas_plans`

- `id` uuid, obrigatório
- `nome` text, obrigatório
- `descricao` text
- `preco` numeric, obrigatório, padrão `0`
- `periodicidade` text, obrigatório
- `ativo` boolean, obrigatório, padrão `true`
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `subscriptions`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `plan_id` uuid, obrigatório
- `status` text, obrigatório
- `inicio_em` timestamp with time zone, obrigatório
- `fim_em` timestamp with time zone
- `external_ref` text

#### `payments`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `subscription_id` uuid
- `amount` numeric, obrigatório
- `currency` text, obrigatório, padrão `BRL`
- `status` text, obrigatório
- `paid_at` timestamp with time zone
- `external_ref` text
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

### Integrações e webhooks

#### `erp_integrations`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `nome` text, obrigatório
- `tipo` text, obrigatório
- `endpoint_url` text
- `ativo` boolean, obrigatório, padrão `true`
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `erp_credentials`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `integration_id` uuid, obrigatório
- `secret_ciphertext` bytea, obrigatório
- `encryption_key_version` text, obrigatório
- `atualizado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `webhooks`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `nome` text, obrigatório
- `endpoint_url` text, obrigatório
- `evento` text, obrigatório
- `secret_ciphertext` bytea, obrigatório
- `encryption_key_version` text, obrigatório
- `ativo` boolean, obrigatório, padrão `true`
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

#### `webhook_deliveries`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `webhook_id` uuid, obrigatório
- `evento` text, obrigatório
- `payload` jsonb, obrigatório
- `status` text, obrigatório
- `tentativas` integer, obrigatório, padrão `0`
- `entregue_em` timestamp with time zone
- `ultimo_erro` text
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

### Operação e auditoria

#### `maintenance`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `titulo` text, obrigatório
- `descricao` text
- `inicio_em` timestamp with time zone, obrigatório
- `fim_em` timestamp with time zone
- `status` text, obrigatório, padrão `scheduled`

#### `audit_logs`

- `id` uuid, obrigatório
- `tenant_id` uuid, obrigatório
- `actor_user_id` uuid
- `action` text, obrigatório
- `resource_type` text, obrigatório
- `resource_id` uuid
- `metadata` jsonb, obrigatório, padrão `{}`
- `criado_em` timestamp with time zone, obrigatório, padrão `now()`

## Convenções para uso do banco

- Usar exatamente os nomes reais das tabelas e colunas descritos neste documento.
- Filtrar operações pelo `tenant_id` sempre que a tabela possuir essa coluna.
- Reutilizar o cliente exportado por `src/lib/supabase.ts`.
- Usar o Supabase Auth para autenticação, com `signUp`, `signInWithPassword`, `signOut`, `getSession` e `onAuthStateChange` quando esses fluxos forem implementados.
- Depois do cadastro de um usuário, criar ou atualizar os registros relacionados em `users` e nos demais recursos necessários ao tenant.
- Não armazenar senhas diretamente nas tabelas públicas.
- Não expor segredos de integrações ou webhooks no frontend; os campos `secret_ciphertext` e `encryption_key_version` devem ser tratados como dados sensíveis.
- Respeitar as políticas de segurança e as permissões configuradas no Supabase.
- Usar os campos JSONB para configurações flexíveis sem criar nomes de colunas que não existam no schema.

## Índices e chaves

As tabelas operacionais que possuem `tenant_id` contam com índices para facilitar consultas filtradas por tenant. As tabelas com identificador `id` possuem chave primária nesse campo, enquanto `tenant_branding` e `tenant_settings` usam `tenant_id` como chave primária.

Ao criar consultas para listagens administrativas, priorize filtros por `tenant_id` e utilize ordenação pelos campos de data existentes, como `criado_em`, `atualizado_em` ou `inicio_em`, conforme o domínio.

## Próximos passos

- Adicionar autenticação e proteção das áreas administrativas.
- Implementar seleção do tenant ativo para usuários associados a mais de uma organização.
- Criar as telas de clientes, tickets, notificações, assinaturas e integrações.
- Adicionar formulários de criação e edição conectados ao Supabase.
- Implementar filtros, paginação e estados de carregamento e erro.
- Registrar ações relevantes em `audit_logs`.
- Integrar entregas reais de notificações e webhooks.
- Adicionar testes para os principais fluxos de leitura e gravação.

## Segurança

- Nunca versionar `.env.local` ou outras credenciais privadas.
- Usar somente a chave pública anon no frontend.
- Manter segredos de integrações fora de componentes de interface e logs do navegador.
- Validar o tenant do usuário antes de ler ou gravar dados.
- Configurar e revisar as políticas de Row Level Security do Supabase antes de disponibilizar novas áreas em produção.
