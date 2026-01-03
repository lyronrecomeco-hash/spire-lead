import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { kanbanColumns } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface PipelineChartProps {
  className?: string;
}

const COLORS = [
  'hsl(199, 89%, 48%)',  // info
  'hsl(217, 91%, 60%)',  // primary
  'hsl(262, 83%, 58%)',  // accent
  'hsl(38, 92%, 50%)',   // warning
  'hsl(38, 92%, 50%)',   // warning
  'hsl(142, 76%, 45%)',  // success
  'hsl(142, 76%, 45%)',  // success
  'hsl(0, 84%, 60%)',    // destructive
];

export function PipelineChart({ className }: PipelineChartProps) {
  const data = kanbanColumns
    .filter(col => col.leads.length > 0)
    .map(col => ({
      name: col.title,
      value: col.leads.length,
      total: col.leads.reduce((sum, lead) => sum + lead.value, 0),
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.value} leads</p>
          <p className="text-sm text-primary">
            R$ {data.total.toLocaleString('pt-BR')}
          </p>
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
      <h3 className="text-lg font-semibold mb-6">Pipeline por Etapa</h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-muted-foreground truncate">{item.name}</span>
            <span className="text-foreground font-medium ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
