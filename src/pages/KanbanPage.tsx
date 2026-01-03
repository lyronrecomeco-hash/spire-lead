import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { useCustomers } from '@/hooks/useCustomers';
import { LeadModal } from '@/components/modals/LeadModal';
import { Plus, Search, MessageCircle, DollarSign, Loader2, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { CustomerModal } from '@/components/modals/CustomerModal';

const columns = [
  { id: 'new', title: 'Novo', color: 'bg-info' },
  { id: 'contacted', title: 'Contato', color: 'bg-primary' },
  { id: 'proposal', title: 'Proposta', color: 'bg-accent' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-warning' },
  { id: 'waiting_payment', title: 'Pagamento', color: 'bg-warning' },
  { id: 'closed', title: 'Concluído', color: 'bg-success' },
  { id: 'lost', title: 'Perdido', color: 'bg-destructive' },
];

const paymentStatusLabels: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendente', color: 'text-warning', icon: XCircle },
  partial: { label: 'Parcial', color: 'text-info', icon: DollarSign },
  paid: { label: 'Pago', color: 'text-success', icon: CheckCircle },
  overdue: { label: 'Atrasado', color: 'text-destructive', icon: XCircle },
};

function KanbanColumn({ column, leads, onCardClick, onAddLead }: { 
  column: typeof columns[0]; 
  leads: any[]; 
  onCardClick: (lead: any) => void;
  onAddLead: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const total = leads.reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <div className="kanban-column min-w-[260px] lg:min-w-[280px] flex-shrink-0">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', column.color)} />
          <span className="font-medium text-xs lg:text-sm text-foreground">{column.title}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{leads.length}</span>
        </div>
        <button 
          onClick={onAddLead}
          className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="text-xs text-muted-foreground mb-2">
        R$ {total.toLocaleString('pt-BR')}
      </div>
      <div
        ref={setNodeRef}
        className={cn('space-y-2 min-h-[100px] rounded transition-colors', isOver && 'bg-primary/10')}
      >
        {leads.map((lead) => {
          const paymentInfo = paymentStatusLabels[lead.payment_status] || paymentStatusLabels.pending;
          const PaymentIcon = paymentInfo.icon;
          
          return (
            <div
              key={lead.id}
              className="glass-card-hover p-2.5 lg:p-3 cursor-pointer"
              onClick={() => onCardClick(lead)}
            >
              {/* Payment Status Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className={cn('flex items-center gap-1 text-xs font-medium', paymentInfo.color)}>
                  <PaymentIcon className="w-3 h-3" />
                  {paymentInfo.label}
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
              
              {/* Lead Info */}
              <div className="mb-2">
                <p className="font-medium text-xs lg:text-sm text-foreground truncate">{lead.customer?.name || 'Sem cliente'}</p>
                <p className="text-xs text-muted-foreground truncate">{lead.product}</p>
              </div>
              
              {/* Value */}
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                <DollarSign className="w-3 h-3" />
                R$ {lead.value?.toLocaleString('pt-BR')}
              </div>
            </div>
          );
        })}
        {leads.length === 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground">Vazio</div>
        )}
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const { leads, loading, updateLeadStatus, updateLead } = useLeads();
  const { createCustomer } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [defaultStatus, setDefaultStatus] = useState<string>('new');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const filteredLeads = leads.filter(lead =>
    lead.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const leadId = active.id as string;
      const newStatus = over.id as string;
      const lead = leads.find(l => l.id === leadId);
      
      if (columns.some(c => c.id === newStatus) && lead) {
        // Se mover para closed, marca como pago automaticamente
        if (newStatus === 'closed' && lead.payment_status !== 'paid') {
          await updateLead(leadId, { status: newStatus, payment_status: 'paid' });
        } else {
          await updateLeadStatus(leadId, newStatus);
        }
      }
    }
  };

  const handleAddLead = (status: string) => {
    setDefaultStatus(status);
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Pipeline de Vendas</h1>
            <p className="text-xs lg:text-sm text-muted-foreground">Arraste os cards entre colunas</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setIsCustomerModalOpen(true)}>
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Cliente</span>
            </Button>
            <Button className="btn-primary gap-2" onClick={() => handleAddLead('new')}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Lead</span>
            </Button>
          </div>
        </div>

        <div className="relative mb-4 max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 input-field h-9" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  leads={filteredLeads.filter(l => l.status === column.id)}
                  onCardClick={(lead) => { setEditingLead(lead); setIsLeadModalOpen(true); }}
                  onAddLead={() => handleAddLead(column.id)}
                />
              ))}
            </div>
          </DndContext>
        )}
      </div>

      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => { setIsLeadModalOpen(false); setEditingLead(null); }} 
        lead={editingLead}
        defaultStatus={defaultStatus}
      />
      <CustomerModal 
        isOpen={isCustomerModalOpen} 
        onClose={() => setIsCustomerModalOpen(false)} 
      />
    </MainLayout>
  );
}
