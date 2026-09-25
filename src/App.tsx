import { FormEvent, useCallback, useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type Customer = {
  id: string
  nome: string
  email: string | null
  documento: string | null
  ativo: boolean
  criado_em: string
}

type Ticket = {
  id: string
  assunto: string
  status: string
  prioridade: string
  criado_em: string
}

type Tenant = {
  id: string
  nome: string
  slug: string
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

const statusLabel: Record<string, string> = {
  open: 'Aberto',
  pending: 'Pendente',
  closed: 'Fechado',
  resolved: 'Resolvido',
}

const priorityLabel: Record<string, string> = {
  low: 'Baixa',
  normal: 'Normal',
  high: 'Alta',
  urgent: 'Urgente',
}

function App() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [customerCount, setCustomerCount] = useState(0)
  const [ticketCount, setTicketCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [sessionEmail, setSessionEmail] = useState('')
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerDocument, setCustomerDocument] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      setError(sessionError.message)
      setLoading(false)
      return
    }

    const user = sessionData.session?.user
    if (!user) {
      setSessionEmail('')
      setTenant(null)
      setLoading(false)
      return
    }

    setSessionEmail(user.email ?? '')

    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .select('id, nome, slug')
      .eq('owner_id', user.id)
      .eq('ativo', true)
      .limit(1)
      .maybeSingle()

    if (tenantError) {
      setError(tenantError.message)
      setLoading(false)
      return
    }

    if (!tenantData) {
      setTenant(null)
      setLoading(false)
      return
    }

    setTenant(tenantData)

    const [customersResult, ticketsResult, customerCountResult, ticketCountResult] = await Promise.all([
      supabase
        .from('customers')
        .select('id, nome, email, documento, ativo, criado_em')
        .eq('tenant_id', tenantData.id)
        .order('criado_em', { ascending: false })
        .limit(6),
      supabase
        .from('tickets')
        .select('id, assunto, status, prioridade, criado_em')
        .eq('tenant_id', tenantData.id)
        .order('criado_em', { ascending: false })
        .limit(6),
      supabase.from('customers').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantData.id),
      supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantData.id),
    ])

    const queryError = customersResult.error ?? ticketsResult.error ?? customerCountResult.error ?? ticketCountResult.error
    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }

    setCustomers((customersResult.data ?? []) as Customer[])
    setTickets((ticketsResult.data ?? []) as Ticket[])
    setCustomerCount(customerCountResult.count ?? 0)
    setTicketCount(ticketCountResult.count ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const handleCreateCustomer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!tenant || !customerName.trim()) return

    setSaving(true)
    setError('')

    const { error: insertError } = await supabase.from('customers').insert({
      tenant_id: tenant.id,
      nome: customerName.trim(),
      email: customerEmail.trim() || null,
      documento: customerDocument.trim() || null,
      ativo: true,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setCustomerName('')
    setCustomerEmail('')
    setCustomerDocument('')
    setShowCustomerForm(false)
    setSaving(false)
    await loadDashboard()
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">Carregando seu painel...</p>
        </div>
      </main>
    )
  }

  if (!sessionEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <section className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">S</div>
          <h1 className="mt-6 text-2xl font-bold">Acesso administrativo</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Entre com uma conta autenticada para acessar os dados do seu tenant.
          </p>
          {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-left text-sm text-red-700">{error}</p>}
        </section>
      </main>
    )
  }

  if (!tenant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <section className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">S</div>
          <h1 className="mt-6 text-2xl font-bold">Nenhum tenant ativo</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            A conta {sessionEmail} ainda não possui um tenant ativo associado como proprietário.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">S</div>
            <div>
              <p className="text-sm font-semibold tracking-wide">SaaS Admin</p>
              <p className="text-xs text-muted-foreground">Painel operacional</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{tenant.nome}</p>
              <p className="text-xs text-muted-foreground">{sessionEmail}</p>
            </div>
            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">Tenant ativo</span>
          </div>
        </header>

        <section className="flex flex-1 flex-col py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Visão geral</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Olá, {tenant.nome}.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Acompanhe a operação do seu tenant e mantenha clientes e atendimentos organizados em um só lugar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomerForm((current) => !current)}
              className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              {showCustomerForm ? 'Fechar formulário' : 'Novo cliente'}
            </button>
          </div>

          {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Não foi possível concluir a operação: {error}</div>}

          {showCustomerForm && (
            <form onSubmit={handleCreateCustomer} className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">Cadastrar cliente</h2>
                <p className="mt-1 text-sm text-muted-foreground">Os dados serão gravados no tenant {tenant.nome}.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-sm font-medium">
                  Nome
                  <input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none ring-primary/30 transition focus:ring-4" placeholder="Nome do cliente" />
                </label>
                <label className="text-sm font-medium">
                  E-mail
                  <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none ring-primary/30 transition focus:ring-4" placeholder="cliente@empresa.com" />
                </label>
                <label className="text-sm font-medium">
                  Documento
                  <input value={customerDocument} onChange={(event) => setCustomerDocument(event.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none ring-primary/30 transition focus:ring-4" placeholder="CPF ou CNPJ" />
                </label>
              </div>
              <div className="mt-5 flex justify-end">
                <button disabled={saving} type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? 'Salvando...' : 'Salvar cliente'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Clientes cadastrados</p>
              <p className="mt-3 text-3xl font-bold">{customerCount}</p>
              <p className="mt-2 text-xs text-muted-foreground">Registros ativos no tenant</p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Tickets registrados</p>
              <p className="mt-3 text-3xl font-bold">{ticketCount}</p>
              <p className="mt-2 text-xs text-muted-foreground">Solicitações de atendimento</p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Módulos disponíveis</p>
              <p className="mt-3 text-3xl font-bold">04</p>
              <p className="mt-2 text-xs text-muted-foreground">Clientes, suporte, avisos e integrações</p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Identificador</p>
              <p className="mt-3 truncate text-lg font-bold">{tenant.slug}</p>
              <p className="mt-2 text-xs text-muted-foreground">Slug operacional do tenant</p>
            </article>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border p-5">
                <div>
                  <h2 className="font-semibold">Clientes recentes</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Últimos cadastros realizados</p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">customers</span>
              </div>
              <div className="divide-y divide-border">
                {customers.length === 0 ? (
                  <p className="p-5 text-sm text-muted-foreground">Nenhum cliente cadastrado ainda.</p>
                ) : customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{customer.nome}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{customer.email || 'E-mail não informado'}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${customer.ativo ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                        {customer.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                      <p className="mt-2 text-xs text-muted-foreground">{formatDate(customer.criado_em)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border p-5">
                <div>
                  <h2 className="font-semibold">Atendimento recente</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Tickets que precisam de acompanhamento</p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">tickets</span>
              </div>
              <div className="divide-y divide-border">
                {tickets.length === 0 ? (
                  <p className="p-5 text-sm text-muted-foreground">Nenhum ticket registrado ainda.</p>
                ) : tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{ticket.assunto}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(ticket.criado_em)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-medium text-primary">{statusLabel[ticket.status] || ticket.status}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Prioridade {priorityLabel[ticket.prioridade] || ticket.prioridade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
          Dados persistidos no Supabase e filtrados pelo tenant {tenant.slug}.
        </footer>
      </div>
    </main>
  )
}

export default App
