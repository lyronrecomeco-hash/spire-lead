import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { useTasks } from '@/hooks/useTasks';
import { useMemo } from 'react';
import { User, Target, CheckCircle, DollarSign, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EquipePage() {
  const { leads } = useLeads();
  const { tasks } = useTasks();

  // Agrupa por assigned_to
  const teamStats = useMemo(() => {
    const assignedLeads = leads.filter(l => l.assigned_to);
    const assignees = [...new Set(assignedLeads.map(l => l.assigned_to))];

    return assignees.map(name => {
      const memberLeads = leads.filter(l => l.assigned_to === name);
      const closedLeads = memberLeads.filter(l => l.status === 'closed');
      const memberTasks = tasks.filter(t => t.assigned_to === name);
      const completedTasks = memberTasks.filter(t => t.status === 'completed');
      const totalValue = closedLeads.reduce((sum, l) => sum + (l.value || 0), 0);
      const conversionRate = memberLeads.length > 0 
        ? ((closedLeads.length / memberLeads.length) * 100).toFixed(0) 
        : '0';

      return {
        name,
        totalLeads: memberLeads.length,
        closedLeads: closedLeads.length,
        totalTasks: memberTasks.length,
        completedTasks: completedTasks.length,
        totalValue,
        conversionRate,
      };
    }).sort((a, b) => b.totalValue - a.totalValue);
  }, [leads, tasks]);

  const topPerformer = teamStats[0];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Equipe</h1>
          <p className="text-muted-foreground text-sm">Desempenho e métricas da equipe</p>
        </div>

        {/* Top Performer */}
        {topPerformer && (
          <div className="glass-card p-6 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/20">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Performer</p>
                <p className="text-2xl font-bold text-foreground">{topPerformer.name}</p>
                <p className="text-sm text-primary">
                  R$ {topPerformer.totalValue.toLocaleString('pt-BR')} em vendas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Team Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Membros</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{teamStats.length}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-info/20">
                <Target className="w-5 h-5 text-info" />
              </div>
              <span className="text-sm text-muted-foreground">Leads Atribuídos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {teamStats.reduce((sum, m) => sum + m.totalLeads, 0)}
            </p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Vendas Fechadas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {teamStats.reduce((sum, m) => sum + m.closedLeads, 0)}
            </p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Receita Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              R$ {(teamStats.reduce((sum, m) => sum + m.totalValue, 0) / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Desempenho Individual</h3>
          <div className="space-y-3">
            {teamStats.map((member, index) => (
              <div key={member.name} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                      index === 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>{member.totalLeads} leads</span>
                        <span>{member.closedLeads} vendas</span>
                        <span>{member.completedTasks}/{member.totalTasks} tarefas</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">R$ {member.totalValue.toLocaleString('pt-BR')}</p>
                    <div className="flex items-center gap-1 text-xs text-success justify-end">
                      <TrendingUp className="w-3 h-3" />
                      {member.conversionRate}% conversão
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {teamStats.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum membro com leads atribuídos
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
