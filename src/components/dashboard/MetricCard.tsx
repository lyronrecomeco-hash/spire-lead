import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'from-muted to-muted/50',
  primary: 'from-primary/20 to-primary/5',
  success: 'from-success/20 to-success/5',
  warning: 'from-warning/20 to-warning/5',
  danger: 'from-destructive/20 to-destructive/5',
};

const iconColors = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn('metric-card group', className)}
    >
      <div className={cn(
        'absolute inset-0 opacity-30 rounded-xl bg-gradient-to-br',
        variantStyles[variant]
      )} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'p-3 rounded-xl bg-gradient-to-br',
            variantStyles[variant]
          )}>
            <Icon className={cn('w-6 h-6', iconColors[variant])} />
          </div>
          
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
        
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
