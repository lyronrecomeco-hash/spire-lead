import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { KanbanColumn as KanbanColumnType } from '@/types/crm';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCardClick?: (leadId: string) => void;
}

export function KanbanColumn({ column, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  
  const totalValue = column.leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="kanban-column"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn('w-3 h-3 rounded-full', column.color)} />
          <h3 className="font-semibold text-foreground">{column.title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            {column.leads.length}
          </span>
        </div>
        
        <button className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Total Value */}
      <div className="text-sm text-muted-foreground mb-4">
        Total: <span className="text-primary font-medium">R$ {totalValue.toLocaleString('pt-BR')}</span>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={cn(
          'space-y-3 min-h-[200px] p-1 rounded-lg transition-colors',
          isOver && 'bg-primary/10 border-2 border-dashed border-primary/30'
        )}
      >
        <SortableContext
          items={column.leads.map(lead => lead.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onClick={() => onCardClick?.(lead.id)}
            />
          ))}
        </SortableContext>
        
        {column.leads.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Nenhum lead nesta etapa
          </div>
        )}
      </div>
    </motion.div>
  );
}
