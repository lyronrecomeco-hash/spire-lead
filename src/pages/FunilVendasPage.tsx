import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, Target, DollarSign, Percent } from 'lucide-react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';

const stageColors = {
  new: 'hsl(var(--info))',
  contacted: 'hsl(var(--primary))',
  proposal: 'hsl(var(--accent))',
  negotiation: 'hsl(var(--warning))',
  waiting_payment: 'hsl(var(--warning))',
  closed: 'hsl(var(--success))',
  lost: 'hsl(var(--destructive))',
};

const stageLabels: Record<string, string> = {
  new: 'Novos Leads',
  contacted: 'Contato Realizado',
  proposal: 'Proposta Enviada',
  negotiation: 'Em Negociação',
  waiting_payment: 'Aguardando Pagamento',
  closed: 'Vendas Fechadas',
  lost: 'Perdidos',
};

export default function FunilVendasPage() {
  const { leads, loading } = useLeads();

  const funnelData = useMemo(() => {
    const stages = ['new', 'contacted', 'proposal', 'negotiation', 'waiting_payment', 'closed'];
    
    return stages.map(stage => {
      const stageLeads = leads.filter(l => l.status === stage);
      const total = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);
      
      return {
        name: stageLabels[stage] || stage,
        value: stageLeads.length,
        total,
        fill: stageColors[stage as keyof typeof stageColors] || 'hsl(var(--muted))',
      };
    });
  }, [leads]);

  const metrics = useMemo(() => {
    const total = leads.length;
    const closed = leads.filter(l => l.status === 'closed').length;
    const lost = leads.filter(l => l.status === 'lost').length;
    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : '0';
    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
    const closedValue = leads.filter(l => l.status === 'closed').reduce((sum, l) => sum + (l.value || 0), 0);
    
    return { total, closed, lost, conversionRate, totalValue, closedValue };
  }, [leads]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Funil de Vendas</h1>
          <p className="text-muted-foreground text-sm">Acompanhe a jornada dos seus leads</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Leads</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{metrics.total}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Convertidos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{metrics.closed}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/20">
                <Percent className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Taxa Conversão</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{metrics.conversionRate}%</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Valor Fechado</span>
            </div>
            <p className="text-2xl font-bold text-foreground">R$ {(metrics.closedValue / 1000).toFixed(1)}k</p>
          </div>
        </div>

        {/* Funnel Chart */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-foreground mb-6">Distribuição do Funil</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  content={({ payload }) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
                          <p className="font-medium text-foreground">{data.name}</p>
                          <p className="text-sm text-muted-foreground">{data.value} leads</p>
                          <p className="text-sm text-primary">R$ {data.total.toLocaleString('pt-BR')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Funnel dataKey="value" data={funnelData} isAnimationActive={false}>
                  <LabelList position="center" fill="#fff" fontSize={12} formatter={(v: number) => `${v} leads`} />
                  {funnelData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stage Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {funnelData.map((stage, index) => (
            <div key={index} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.fill }} />
                <div>
                  <p className="font-medium text-foreground">{stage.name}</p>
                  <p className="text-sm text-muted-foreground">{stage.value} leads</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-primary">R$ {stage.total.toLocaleString('pt-BR')}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
