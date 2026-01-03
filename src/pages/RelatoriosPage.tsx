import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { usePayments } from '@/hooks/usePayments';
import { useCustomers } from '@/hooks/useCustomers';
import { useTasks } from '@/hooks/useTasks';
import { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, FileText, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RechartsPie, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--accent))'];

export default function RelatoriosPage() {
  const { leads } = useLeads();
  const { payments } = usePayments();
  const { customers } = useCustomers();
  const { tasks } = useTasks();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;

  // Leads por status (Pie Chart)
  const leadsByStatus = useMemo(() => {
    const statusLabels: Record<string, string> = {
      new: 'Novos',
      contacted: 'Contato',
      proposal: 'Proposta',
      negotiation: 'Negociação',
      waiting_payment: 'Pagamento',
      closed: 'Fechados',
      lost: 'Perdidos',
    };

    const counts: Record<string, number> = {};
    leads.forEach(lead => {
      const status = lead.status;
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
    }));
  }, [leads]);

  // Receita por período (Bar Chart)
  const revenueByPeriod = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthPayments = payments.filter(p => {
        const date = new Date(p.created_at);
        return date >= monthStart && date <= monthEnd && p.status === 'paid';
      });

      return {
        month: format(month, 'MMM', { locale: ptBR }),
        valor: monthPayments.reduce((sum, p) => sum + p.amount, 0),
      };
    });
  }, [payments]);

  // Leads por dia (Area Chart)
  const leadsByDay = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), periodDays - 1),
      end: new Date(),
    });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const count = leads.filter(l => format(new Date(l.created_at), 'yyyy-MM-dd') === dayStr).length;
      
      return {
        date: format(day, 'dd/MM'),
        leads: count,
      };
    });
  }, [leads, periodDays]);

  // KPIs
  const kpis = useMemo(() => {
    const closedLeads = leads.filter(l => l.status === 'closed');
    const totalRevenue = closedLeads.reduce((sum, l) => sum + (l.value || 0), 0);
    const avgTicket = closedLeads.length > 0 ? totalRevenue / closedLeads.length : 0;
    const conversionRate = leads.length > 0 ? ((closedLeads.length / leads.length) * 100).toFixed(1) : '0';
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(0) : '0';

    return {
      totalRevenue,
      avgTicket,
      conversionRate,
      totalCustomers: customers.length,
      totalLeads: leads.length,
      taskCompletionRate,
    };
  }, [leads, customers, tasks]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Relatórios</h1>
            <p className="text-muted-foreground text-sm">Análises e métricas do seu negócio</p>
          </div>
          <div className="flex gap-2">
            <Button variant={period === '7d' ? 'default' : 'outline'} size="sm" onClick={() => setPeriod('7d')}>
              7 dias
            </Button>
            <Button variant={period === '30d' ? 'default' : 'outline'} size="sm" onClick={() => setPeriod('30d')}>
              30 dias
            </Button>
            <Button variant={period === '90d' ? 'default' : 'outline'} size="sm" onClick={() => setPeriod('90d')}>
              90 dias
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Receita Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">R$ {(kpis.totalRevenue / 1000).toFixed(1)}k</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Ticket Médio</span>
            </div>
            <p className="text-2xl font-bold text-foreground">R$ {kpis.avgTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/20">
                <PieChart className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Taxa Conversão</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.conversionRate}%</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-info/20">
                <Users className="w-5 h-5 text-info" />
              </div>
              <span className="text-sm text-muted-foreground">Total Clientes</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.totalCustomers}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/20">
                <FileText className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Total Leads</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.totalLeads}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <Calendar className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Tarefas Concluídas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.taskCompletionRate}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Status */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Leads por Status</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={leadsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {leadsByStatus.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        return (
                          <div className="bg-card border border-border rounded-lg p-2 shadow-xl">
                            <p className="text-sm font-medium">{payload[0].name}: {payload[0].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Month */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Receita Mensal</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    content={({ payload, label }) => {
                      if (payload && payload[0]) {
                        return (
                          <div className="bg-card border border-border rounded-lg p-2 shadow-xl">
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-sm text-success">R$ {payload[0].value?.toLocaleString('pt-BR')}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="valor" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Leads Over Time */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Novos Leads ({period === '7d' ? 'Últimos 7 dias' : period === '30d' ? 'Últimos 30 dias' : 'Últimos 90 dias'})</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsByDay}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} allowDecimals={false} />
                <Tooltip 
                  content={({ payload, label }) => {
                    if (payload && payload[0]) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 shadow-xl">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-sm text-primary">{payload[0].value} leads</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="leads" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
