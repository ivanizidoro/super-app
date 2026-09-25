const resources = [
  {
    title: 'Clientes',
    description: 'Centralize cadastros, documentos e referências externas.',
    value: 'customers',
  },
  {
    title: 'Atendimento',
    description: 'Acompanhe tickets e mensagens em um único fluxo.',
    value: 'tickets',
  },
  {
    title: 'Notificações',
    description: 'Organize campanhas, entregas e comunicações importantes.',
    value: 'notifications',
  },
  {
    title: 'Integrações',
    description: 'Conecte ERPs, webhooks e configurações por tenant.',
    value: 'erp_integrations',
  },
]

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
              S
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-foreground">SaaS Admin</p>
              <p className="text-xs text-muted-foreground">Painel operacional</p>
            </div>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Ambiente inicial
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Visão geral</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Gestão SaaS clara, conectada e pronta para crescer.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Uma base administrativa para operar clientes, suporte, notificações e integrações com dados organizados por tenant.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => (
              <article key={resource.value} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50">
                <div className="mb-8 flex items-center justify-between">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <code className="text-xs text-muted-foreground">{resource.value}</code>
                </div>
                <h2 className="text-lg font-semibold text-card-foreground">{resource.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
          Dados persistidos no Supabase e organizados pela estrutura multi-tenant do projeto.
        </footer>
      </div>
    </main>
  )
}

export default App