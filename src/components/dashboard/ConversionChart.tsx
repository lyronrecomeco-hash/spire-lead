import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ConversionChartProps {
  className?: string;
}

const data = [
  { stage: 'Leads', value: 100, fill: 'hsl(199, 89%, 48%)' },
  { stage: 'Contato', value: 75, fill: 'hsl(217, 91%, 60%)' },
  { stage: 'Proposta', value: 45, fill: 'hsl(262, 83%, 58%)' },
  { stage: 'Negociação', value: 30, fill: 'hsl(38, 92%, 50%)' },
  { stage: 'Fechado', value: 15, fill: 'hsl(142, 76%, 45%)' },
];

export function ConversionChart({ className }: ConversionChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="font-medium text-foreground">{data.stage}</p>
          <p className="text-sm text-primary">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('glass-card p-6', className)}
    >
      <h3 className="text-lg font-semibold mb-6">Conversão por Estágio</h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barCategoryGap="20%">
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222, 47%, 16%)" 
              horizontal={false}
            />
            <XAxis 
              type="number" 
              domain={[0, 100]}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <YAxis 
              type="category" 
              dataKey="stage"
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(217, 91%, 60%, 0.1)' }} />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              fill="url(#barGradient)"
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                <stop offset="100%" stopColor="hsl(262, 83%, 58%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
