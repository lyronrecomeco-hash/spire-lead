import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Lead } from '@/types/crm';
import { MessageCircle, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getPaymentStatusColor, getPaymentStatusLabel } from '@/data/mockData';

interface KanbanCardProps {
  lead: Lead;
  onClick?: () => void;
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const today = startOfDay(new Date());
  const isFollowUpOverdue = lead.nextFollowUp && isBefore(lead.nextFollowUp, today);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        'kanban-card select-none',
        isDragging && 'opacity-50 shadow-glow z-50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground truncate">{lead.customer.name}</h4>
          {lead.customer.company && (
            <p className="text-xs text-muted-foreground truncate">{lead.customer.company}</p>
          )}
        </div>
        
        <button 
          className="p-2 rounded-lg bg-success/20 hover:bg-success/30 text-success transition-colors flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`https://wa.me/${lead.customer.phone.replace(/\D/g, '')}`, '_blank');
          }}
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Product & Value */}
      <div className="mb-3">
        <p className="text-sm text-muted-foreground mb-1">{lead.product}</p>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">
            R$ {lead.value.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Status & Alerts */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn('status-badge', getPaymentStatusColor(lead.paymentStatus))}>
          {getPaymentStatusLabel(lead.paymentStatus)}
        </span>
        
        {isFollowUpOverdue && (
          <span className="status-badge status-danger flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Follow-up
          </span>
        )}
      </div>

      {/* Last Contact */}
      {lead.lastContact && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Último contato: {format(lead.lastContact, "dd/MM", { locale: ptBR })}</span>
        </div>
      )}

      {/* Tags */}
      {lead.tags.length > 0 && (
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {lead.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
          {lead.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{lead.tags.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
