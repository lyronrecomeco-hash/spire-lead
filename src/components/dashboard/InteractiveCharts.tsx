import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useLeads } from '@/hooks/useLeads';
import { usePayments } from '@/hooks/usePayments';
import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="font-medium text-foreground text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.value >= 1000 
              ? `R$ ${entry.value.toLocaleString('pt-BR')}` 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function LeadsOverTimeChart() {
  const { leads } = useLeads();

  const data = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return last7Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const count = leads.filter(lead => {
        const leadDate = format(new Date(lead.created_at), 'yyyy-MM-dd');
        return leadDate === dayStr;
      }).length;

      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        leads: count,
      };
    });
  }, [leads]);

  const maxValue = Math.max(...data.map(d => d.leads), 4);

  return (
    <div className="glass-card p-4 lg:p-6">
      <h3 className="font-semibold text-foreground mb-4">Novos Leads</h3>
      <div className="h-[200px] lg:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={true} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, maxValue]}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="linear" 
              dataKey="leads" 
              name="Leads"
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RevenueOverTimeChart() {
  const { payments } = usePayments();

  const data = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return last7Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayPayments = payments.filter(p => {
        const paymentDate = format(new Date(p.created_at), 'yyyy-MM-dd');
        return paymentDate === dayStr && p.status === 'paid';
      });
      const total = dayPayments.reduce((sum, p) => sum + p.amount, 0);

      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        valor: total,
      };
    });
  }, [payments]);

  const maxValue = Math.max(...data.map(d => d.valor), 1000);

  return (
    <div className="glass-card p-4 lg:p-6">
      <h3 className="font-semibold text-foreground mb-4">Receita (7 dias)</h3>
      <div className="h-[200px] lg:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={true} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, maxValue]}
              tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="linear" 
              dataKey="valor" 
              name="Receita"
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              fill="url(#colorRevenue)"
              dot={{ fill: 'hsl(var(--success))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--success))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
