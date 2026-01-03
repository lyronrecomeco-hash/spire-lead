import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useActivities } from '@/hooks/useActivities';
import { useTasks } from '@/hooks/useTasks';
import { PipelineChart, ConversionFunnelChart, LeadsBySourceChart, RevenueChart } from '@/components/dashboard/InteractiveCharts';
import { Users, Handshake, TrendingUp, DollarSign, AlertCircle, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { metrics, loading } = useDashboardMetrics();
  const { activities } = useActivities();
  const { tasks } = useTasks();

  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-sm lg:text-base">Visão geral - Genesis Projects</p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <MetricCard title="Leads Ativos" value={loading ? '...' : metrics.activeLeads} icon={Users} variant="primary" />
          <MetricCard title="Negociações" value={loading ? '...' : metrics.ongoingNegotiations} icon={Handshake} variant="warning" />
          <MetricCard title="Vendas (Mês)" value={loading ? '...' : metrics.closedDealsMonth} icon={TrendingUp} variant="success" />
          <MetricCard title="Pendente" value={loading ? '...' : `R$ ${(metrics.pendingValue / 1000).toFixed(0)}k`} icon={DollarSign} variant="default" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <PipelineChart />
          <ConversionFunnelChart />
          <LeadsBySourceChart />
          <RevenueChart />
        </div>

        {/* Tasks and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 lg:p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Tarefas Pendentes
            </h3>
            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhuma tarefa pendente</p>
              ) : (
                pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(task.due_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <span className={`status-badge flex-shrink-0 ml-2 ${task.priority === 'urgent' ? 'status-danger' : task.priority === 'high' ? 'status-warning' : 'status-info'}`}>
                      {task.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 lg:p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Atividades Recentes
            </h3>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
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
                <p className="text-muted-foreground text-sm">Nenhuma atividade recente</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
