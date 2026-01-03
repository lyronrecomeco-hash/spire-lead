import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { useLeads, Lead } from '@/hooks/useLeads';
import { usePayments } from '@/hooks/usePayments';
import { useMemo } from 'react';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

const statusLabels: Record<string, string> = {
  new: 'Novo',
  contacted: 'Contato',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  waiting_payment: 'Aguardando',
  closed: 'Fechado',
  post_sale: 'Pós-venda',
  lost: 'Perdido',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-border/50">
        <p className="font-medium text-foreground text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.value >= 1000 
              ? `R$ ${(entry.value / 1000).toFixed(1)}k` 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PipelineChart() {
  const { leads } = useLeads();

  const data = useMemo(() => {
    const statusCount: Record<string, { count: number; value: number }> = {};
    
    leads.forEach((lead) => {
      if (!statusCount[lead.status]) {
        statusCount[lead.status] = { count: 0, value: 0 };
      }
      statusCount[lead.status].count += 1;
      statusCount[lead.status].value += lead.value;
    });

    return Object.entries(statusCount).map(([status, data]) => ({
      name: statusLabels[status] || status,
      leads: data.count,
      valor: data.value,
    }));
  }, [leads]);

  if (leads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Pipeline de Vendas</h3>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Sem dados para exibir
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 lg:p-6"
    >
      <h3 className="font-semibold text-foreground mb-4">Pipeline de Vendas</h3>
      <div className="h-[250px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="leads" name="Leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function ConversionFunnelChart() {
  const { leads } = useLeads();

  const funnelData = useMemo(() => {
    const stages = ['new', 'contacted', 'proposal', 'negotiation', 'waiting_payment', 'closed'];
    const counts = stages.map(status => 
      leads.filter(l => stages.indexOf(l.status) >= stages.indexOf(status)).length
    );

    return stages.map((status, i) => ({
      name: statusLabels[status],
      value: counts[i],
      fill: COLORS[i % COLORS.length],
    }));
  }, [leads]);

  if (leads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Funil de Conversão</h3>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Sem dados para exibir
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-4 lg:p-6"
    >
      <h3 className="font-semibold text-foreground mb-4">Funil de Conversão</h3>
      <div className="h-[250px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={funnelData} 
            layout="vertical" 
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" horizontal={false} />
            <XAxis 
              type="number" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <YAxis 
              type="category" 
              dataKey="name"
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]}>
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function LeadsBySourceChart() {
  const { leads } = useLeads();

  const data = useMemo(() => {
    const sourceCount: Record<string, number> = {};
    
    leads.forEach((lead) => {
      const source = lead.customer?.source || 'Desconhecido';
      sourceCount[source] = (sourceCount[source] || 0) + 1;
    });

    return Object.entries(sourceCount).map(([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length],
    }));
  }, [leads]);

  if (leads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Leads por Origem</h3>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Sem dados para exibir
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-4 lg:p-6"
    >
      <h3 className="font-semibold text-foreground mb-4">Leads por Origem</h3>
      <div className="h-[250px] lg:h-[300px] flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function RevenueChart() {
  const { payments } = usePayments();

  const data = useMemo(() => {
    const monthlyData: Record<string, { received: number; pending: number }> = {};
    
    payments.forEach((payment) => {
      const date = new Date(payment.due_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { received: 0, pending: 0 };
      }
      
      if (payment.status === 'paid') {
        monthlyData[monthKey].received += payment.amount;
      } else {
        monthlyData[monthKey].pending += payment.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        name: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
        recebido: data.received,
        pendente: data.pending,
      }));
  }, [payments]);

  if (payments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Receita Mensal</h3>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Sem dados para exibir
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-4 lg:p-6"
    >
      <h3 className="font-semibold text-foreground mb-4">Receita Mensal</h3>
      <div className="h-[250px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="recebido" 
              name="Recebido"
              stackId="1"
              stroke="#10b981" 
              fill="#10b981"
              fillOpacity={0.3}
            />
            <Area 
              type="monotone" 
              dataKey="pendente" 
              name="Pendente"
              stackId="1"
              stroke="#f59e0b" 
              fill="#f59e0b"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
