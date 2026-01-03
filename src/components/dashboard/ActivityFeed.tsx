import { motion } from 'framer-motion';
import { Activity } from '@/types/crm';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  UserPlus, 
  ArrowRightLeft, 
  MessageCircle, 
  DollarSign, 
  CheckCircle, 
  FileText 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

const activityIcons = {
  lead_created: UserPlus,
  status_changed: ArrowRightLeft,
  message_sent: MessageCircle,
  payment_received: DollarSign,
  task_completed: CheckCircle,
  note_added: FileText,
};

const activityColors = {
  lead_created: 'bg-info/20 text-info',
  status_changed: 'bg-primary/20 text-primary',
  message_sent: 'bg-success/20 text-success',
  payment_received: 'bg-success/20 text-success',
  task_completed: 'bg-accent/20 text-accent',
  note_added: 'bg-muted text-muted-foreground',
};

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <div className={cn('glass-card p-6', className)}>
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        Atividades Recentes
      </h3>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
            >
              <div className={cn(
                'p-2 rounded-lg flex-shrink-0',
                activityColors[activity.type]
              )}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.createdAt, { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
