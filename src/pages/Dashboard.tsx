import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useActivities } from '@/hooks/useActivities';
import { useTasks } from '@/hooks/useTasks';
import { useLeads } from '@/hooks/useLeads';
import { usePayments } from '@/hooks/usePayments';
import { LeadsOverTimeChart, RevenueOverTimeChart } from '@/components/dashboard/InteractiveCharts';
import { InteractiveBackground } from '@/components/dashboard/InteractiveBackground';
import { Users, Handshake, TrendingUp, DollarSign, AlertCircle, CheckSquare, Target, Calendar, ArrowUpRight } from 'lucide-react';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { metrics, loading } = useDashboardMetrics();
  const { activities } = useActivities();
  const { tasks } = useTasks();
  const { leads } = useLeads();
  const { payments } = usePayments();

  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);
  
  // Pipeline Summary
  const pipelineSummary = useMemo(() => {
    const stages = [
      { id: 'new', label: 'Novos', color: 'bg-info' },
      { id: 'contacted', label: 'Contato', color: 'bg-primary' },
      { id: 'proposal', label: 'Proposta', color: 'bg-accent' },
      { id: 'negotiation', label: 'Negociação', color: 'bg-warning' },
      { id: 'closed', label: 'Fechados', color: 'bg-success' },
    ];

    return stages.map(stage => ({
      ...stage,
      count: leads.filter(l => l.status === stage.id).length,
      value: leads.filter(l => l.status === stage.id).reduce((sum, l) => sum + (l.value || 0), 0),
    }));
  }, [leads]);

  // Today's Tasks
  const todaysTasks = useMemo(() => {
    return tasks.filter(t => {
      const dueDate = new Date(t.due_date);
      return isToday(dueDate) || (isPast(dueDate) && t.status !== 'completed');
    }).slice(0, 4);
  }, [tasks]);

  // Upcoming Follow-ups
  const upcomingFollowUps = useMemo(() => {
    return leads.filter(l => l.next_follow_up).sort((a, b) => 
      new Date(a.next_follow_up!).getTime() - new Date(b.next_follow_up!).getTime()
    ).slice(0, 4);
  }, [leads]);

  // Recent Payments
  const recentPayments = useMemo(() => {
    return payments.filter(p => p.status === 'paid').sort((a, b) =>
      new Date(b.paid_at || b.created_at).getTime() - new Date(a.paid_at || a.created_at).getTime()
    ).slice(0, 4);
  }, [payments]);

  // Conversion Rate
  const conversionRate = useMemo(() => {
    const total = leads.length;
    const closed = leads.filter(l => l.status === 'closed').length;
    return total > 0 ? ((closed / total) * 100).toFixed(1) : '0';
  }, [leads]);

  return (
    <MainLayout>
      <InteractiveBackground />
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Visão geral - Genesis Projects</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <MetricCard title="Leads Ativos" value={loading ? '...' : metrics.activeLeads} icon={Users} variant="primary" />
          <MetricCard title="Negociações" value={loading ? '...' : metrics.ongoingNegotiations} icon={Handshake} variant="warning" />
          <MetricCard title="Vendas (Mês)" value={loading ? '...' : metrics.closedDealsMonth} icon={TrendingUp} variant="success" />
          <MetricCard title="Conversão" value={loading ? '...' : `${conversionRate}%`} icon={Target} variant="default" />
        </div>

        {/* Pipeline Summary */}
        <div className="glass-card p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Pipeline de Vendas</h3>
            <Link to="/kanban" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver Kanban <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {pipelineSummary.map((stage) => (
              <div key={stage.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                  <span className="text-xs text-muted-foreground">{stage.label}</span>
                </div>
                <p className="text-xl font-bold text-foreground">{stage.count}</p>
                <p className="text-xs text-muted-foreground">R$ {(stage.value / 1000).toFixed(1)}k</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <LeadsOverTimeChart />
          <RevenueOverTimeChart />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Today's Tasks */}
          <div className="glass-card p-4 lg:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                Tarefas de Hoje
              </h3>
              <Link to="/tarefas" className="text-xs text-primary hover:underline">Ver todas</Link>
            </div>
            <div className="space-y-2">
              {todaysTasks.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">Nenhuma tarefa para hoje</p>
              ) : (
                todaysTasks.map((task) => {
                  const isOverdue = isPast(new Date(task.due_date)) && task.status !== 'completed';
                  return (
                    <div key={task.id} className={cn(
                      'flex items-center justify-between p-2.5 rounded-lg',
                      isOverdue ? 'bg-destructive/10' : 'bg-muted/30'
                    )}>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(task.due_date), "HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      {isOverdue && <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Follow-ups */}
          <div className="glass-card p-4 lg:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Próximos Follow-ups
              </h3>
              <Link to="/atendimentos" className="text-xs text-primary hover:underline">Ver todos</Link>
            </div>
            <div className="space-y-2">
              {upcomingFollowUps.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">Nenhum follow-up agendado</p>
              ) : (
                upcomingFollowUps.map((lead) => {
                  const followUpDate = new Date(lead.next_follow_up!);
                  const isTodays = isToday(followUpDate);
                  const isTmrw = isTomorrow(followUpDate);
                  return (
                    <div key={lead.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-foreground truncate">{lead.customer?.name || lead.product}</p>
                        <p className="text-xs text-muted-foreground truncate">{lead.product}</p>
                      </div>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full flex-shrink-0',
                        isTodays ? 'bg-primary/20 text-primary' : isTmrw ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                      )}>
                        {isTodays ? 'Hoje' : isTmrw ? 'Amanhã' : format(followUpDate, 'dd/MM')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="glass-card p-4 lg:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                Pagamentos Recentes
              </h3>
              <Link to="/financeiro" className="text-xs text-primary hover:underline">Ver todos</Link>
            </div>
          <div className="space-y-2">
              {recentPayments.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">Nenhum pagamento recente</p>
              ) : (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">Pagamento Recebido</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(payment.paid_at || payment.created_at), "dd/MM HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-success flex-shrink-0">
                      +R$ {payment.amount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="glass-card p-4 lg:p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Atividades Recentes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), "dd/MM HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-muted-foreground text-sm col-span-full text-center py-4">Nenhuma atividade recente</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}