import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { LeadModal } from '@/components/modals/LeadModal';
import { Plus, Search, MessageCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';

const columns = [
  { id: 'new', title: 'Novo', color: 'bg-info' },
  { id: 'contacted', title: 'Contato', color: 'bg-primary' },
  { id: 'proposal', title: 'Proposta', color: 'bg-accent' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-warning' },
  { id: 'waiting_payment', title: 'Pagamento', color: 'bg-warning' },
  { id: 'closed', title: 'Concluído', color: 'bg-success' },
  { id: 'lost', title: 'Perdido', color: 'bg-destructive' },
];

function KanbanColumn({ column, leads, onCardClick }: { column: typeof columns[0]; leads: any[]; onCardClick: (lead: any) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const total = leads.reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <div className="kanban-column">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', column.color)} />
          <span className="font-medium text-sm text-foreground">{column.title}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{leads.length}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mb-2">
        R$ {total.toLocaleString('pt-BR')}
      </div>
      <div
        ref={setNodeRef}
        className={cn('space-y-2 min-h-[100px] rounded transition-colors', isOver && 'bg-primary/10')}
      >
        {leads.map((lead) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card-hover p-3 cursor-pointer"
            onClick={() => onCardClick(lead)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{lead.customer?.name || 'Sem cliente'}</p>
                <p className="text-xs text-muted-foreground truncate">{lead.product}</p>
              </div>
              {lead.customer?.phone && (
                <button
                  onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.customer.phone.replace(/\D/g, '')}`, '_blank'); }}
                  className="p-1.5 rounded bg-success/20 text-success flex-shrink-0"
                >
                  <MessageCircle className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <DollarSign className="w-3 h-3" />
              R$ {lead.value?.toLocaleString('pt-BR')}
            </div>
          </motion.div>
        ))}
        {leads.length === 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground">Vazio</div>
        )}
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const { leads, loading, updateLeadStatus } = useLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filteredLeads = leads.filter(lead =>
    lead.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const leadId = active.id as string;
      const newStatus = over.id as string;
      if (columns.some(c => c.id === newStatus)) {
        await updateLeadStatus(leadId, newStatus);
      }
    }
    setActiveId(null);
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-8rem)]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pipeline de Vendas</h1>
            <p className="text-sm text-muted-foreground">Arraste os cards entre colunas</p>
          </div>
          <Button className="btn-primary gap-2" onClick={() => { setEditingLead(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4" />
            Novo Lead
          </Button>
        </motion.div>

        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 input-field h-9" />
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  leads={filteredLeads.filter(l => l.status === column.id)}
                  onCardClick={(lead) => { setEditingLead(lead); setIsModalOpen(true); }}
                />
              ))}
            </div>
          </DndContext>
        )}
      </div>

      <LeadModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingLead(null); }} lead={editingLead} />
    </MainLayout>
  );
}
