import { motion } from 'framer-motion';
import { Task } from '@/types/crm';
import { formatDistanceToNow, isAfter, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpcomingTasksProps {
  tasks: Task[];
  className?: string;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info/20 text-info',
  high: 'bg-warning/20 text-warning',
  urgent: 'bg-destructive/20 text-destructive',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

export function UpcomingTasks({ tasks, className }: UpcomingTasksProps) {
  const today = startOfDay(new Date());
  
  const sortedTasks = [...tasks]
    .filter(t => t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  const isOverdue = (date: Date) => isBefore(date, today);
  const isToday = (date: Date) => {
    const taskDate = startOfDay(date);
    return taskDate.getTime() === today.getTime();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass-card p-6', className)}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Próximas Tarefas
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          Ver todas <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma tarefa pendente</p>
          </div>
        ) : (
          sortedTasks.map((task, index) => {
            const overdue = isOverdue(task.dueDate);
            const todayTask = isToday(task.dueDate);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-4 rounded-lg border transition-all hover:border-primary/30 cursor-pointer group',
                  overdue ? 'border-destructive/30 bg-destructive/5' : 'border-border/50 bg-muted/20'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {overdue && (
                        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                      )}
                      <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {task.title}
                      </h4>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        priorityColors[task.priority]
                      )}>
                        {priorityLabels[task.priority]}
                      </span>
                      
                      <span className={cn(
                        'text-xs',
                        overdue ? 'text-destructive' : todayTask ? 'text-warning' : 'text-muted-foreground'
                      )}>
                        {overdue 
                          ? `Atrasada ${formatDistanceToNow(task.dueDate, { locale: ptBR })}`
                          : todayTask 
                            ? 'Hoje'
                            : formatDistanceToNow(task.dueDate, { addSuffix: true, locale: ptBR })
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
