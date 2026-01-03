import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, Target, DollarSign, Percent, ArrowRight, ArrowDown } from 'lucide-react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

const stageColors = {
  new: 'hsl(var(--info))',
  contacted: 'hsl(var(--primary))',
  proposal: 'hsl(var(--accent))',
  negotiation: 'hsl(var(--warning))',
  waiting_payment: 'hsl(38, 92%, 50%)',
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
        stage,
        value: stageLeads.length,
        total,
        fill: stageColors[stage as keyof typeof stageColors] || 'hsl(var(--muted))',
      };
    });
  }, [leads]);

  const conversionRates = useMemo(() => {
    const stages = ['new', 'contacted', 'proposal', 'negotiation', 'waiting_payment', 'closed'];
    const rates = [];
    
    for (let i = 0; i < stages.length - 1; i++) {
      const current = leads.filter(l => l.status === stages[i]).length;
      const next = leads.filter(l => l.status === stages[i + 1]).length;
      const rate = current > 0 ? ((next / current) * 100).toFixed(0) : '0';
      rates.push({
        from: stageLabels[stages[i]],
        to: stageLabels[stages[i + 1]],
        rate: parseFloat(rate),
      });
    }
    
    return rates;
  }, [leads]);

  const metrics = useMemo(() => {
    const total = leads.length;
    const closed = leads.filter(l => l.status === 'closed').length;
    const lost = leads.filter(l => l.status === 'lost').length;
    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : '0';
    const lossRate = total > 0 ? ((lost / total) * 100).toFixed(1) : '0';
    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
    const closedValue = leads.filter(l => l.status === 'closed').reduce((sum, l) => sum + (l.value || 0), 0);
    const avgTicket = closed > 0 ? closedValue / closed : 0;
    
    return { total, closed, lost, conversionRate, lossRate, totalValue, closedValue, avgTicket };
  }, [leads]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Funil de Vendas</h1>
          <p className="text-muted-foreground text-sm">Acompanhe a jornada dos seus leads e taxas de conversão</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
            <p className="text-2xl font-bold text-success">{metrics.closed}</p>
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
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Ticket Médio</span>
            </div>
            <p className="text-2xl font-bold text-foreground">R$ {metrics.avgTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel Chart */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Visualização do Funil</h3>
            <div className="h-[350px]">
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
                    <LabelList position="center" fill="#fff" fontSize={12} formatter={(v: number) => `${v}`} />
                    {funnelData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Leads por Etapa</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" fontSize={11} />
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
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Conversion Rates Flow */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-foreground mb-6">Taxas de Conversão entre Etapas</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-24 h-20 rounded-lg flex flex-col items-center justify-center"
                    style={{ backgroundColor: `${stage.fill}20` }}
                  >
                    <p className="text-2xl font-bold text-foreground">{stage.value}</p>
                    <p className="text-xs text-muted-foreground text-center px-1 truncate w-full">{stage.name.split(' ')[0]}</p>
                  </div>
                </div>
                {index < funnelData.length - 1 && conversionRates[index] && (
                  <div className="flex flex-col items-center mx-1">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    <span className={cn(
                      'text-xs font-bold mt-1',
                      conversionRates[index].rate >= 50 ? 'text-success' :
                      conversionRates[index].rate >= 25 ? 'text-warning' : 'text-destructive'
                    )}>
                      {conversionRates[index].rate}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stage Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnelData.map((stage, index) => (
            <div key={index} className="glass-card p-4 flex items-center justify-between hover:border-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.fill }} />
                <div>
                  <p className="font-medium text-foreground">{stage.name}</p>
                  <p className="text-sm text-muted-foreground">{stage.value} leads</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary">R$ {(stage.total / 1000).toFixed(1)}k</p>
                {metrics.total > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {((stage.value / metrics.total) * 100).toFixed(0)}% do total
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}