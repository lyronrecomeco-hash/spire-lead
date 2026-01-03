import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { useCustomers } from '@/hooks/useCustomers';
import { useKanbanStatuses } from '@/hooks/useKanbanStatuses';
import { LeadModal } from '@/components/modals/LeadModal';
import { Plus, Search, MessageCircle, DollarSign, Loader2, CheckCircle, Clock, UserPlus, Filter, AlertTriangle, Settings2, Trash2 } from 'lucide-react';
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
  DragEndEvent,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { CustomerModal } from '@/components/modals/CustomerModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

type KanbanStatusColumn = { id: string; title: string; color: string };

const paymentStatusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Não Pago', color: 'text-warning', bg: 'bg-warning/20', icon: Clock },
  partial: { label: 'Parcial', color: 'text-info', bg: 'bg-info/20', icon: DollarSign },
  paid: { label: 'Pago', color: 'text-success', bg: 'bg-success/20', icon: CheckCircle },
  overdue: { label: 'Atrasado', color: 'text-destructive', bg: 'bg-destructive/20', icon: AlertTriangle },
};

function KanbanColumn({ column, leads, onCardClick, onAddLead }: { 
  column: KanbanStatusColumn; 
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
          <div className={cn('w-2.5 h-2.5 rounded-full', column.color)} />
          <span className="font-semibold text-sm text-foreground">{column.title}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{leads.length}</span>
        </div>
        <button 
          onClick={onAddLead}
          className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="text-xs text-primary font-medium mb-3">
        R$ {total.toLocaleString('pt-BR')}
      </div>
      <div
        ref={setNodeRef}
        className={cn('space-y-2 min-h-[120px] rounded-lg p-1', isOver && 'bg-primary/10 ring-2 ring-primary/30 ring-dashed')}
      >
        {leads.map((lead) => {
          const paymentInfo = paymentStatusConfig[lead.payment_status] || paymentStatusConfig.pending;
          const PaymentIcon = paymentInfo.icon;
          
          return (
            <div
              key={lead.id}
              className="group relative bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/40 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5"
              onClick={() => onCardClick(lead)}
              draggable
              data-id={lead.id}
            >
              {/* Gradient accent line */}
              <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Header: Payment Status & WhatsApp */}
              <div className="flex items-center justify-between mb-3">
                <div className={cn(
                  'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border backdrop-blur-sm',
                  paymentInfo.color,
                  paymentInfo.bg,
                  'border-current/20'
                )}>
                  <PaymentIcon className="w-3 h-3" />
                  {paymentInfo.label}
                </div>
                {lead.customer?.phone && (
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.customer.phone.replace(/\D/g, '')}`, '_blank'); }}
                    className="p-1.5 rounded-lg bg-success/10 text-success border border-success/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-success/20 hover:scale-110"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              {/* Customer & Product */}
              <div className="mb-3 space-y-1">
                <p className="font-semibold text-sm text-foreground truncate leading-tight">
                  {lead.customer?.name || 'Sem cliente'}
                </p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  {lead.product}
                </p>
              </div>
              
              {/* Value with gradient background */}
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    R$ {lead.value?.toLocaleString('pt-BR')}
                  </span>
                </div>
                {lead.tags && lead.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {lead.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {leads.length === 0 && (
          <div 
            className="flex flex-col items-center justify-center py-8 text-muted-foreground cursor-pointer hover:bg-muted/30 rounded-lg"
            onClick={onAddLead}
          >
            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-xs">Arraste ou adicione</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const { leads, loading: leadsLoading, updateLeadStatus, updateLead } = useLeads();
  const { createCustomer } = useCustomers();
  const { statuses, loading: statusesLoading, createStatus, deleteStatus } = useKanbanStatuses();
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [defaultStatus, setDefaultStatus] = useState<string>('');
  const [newStatusName, setNewStatusName] = useState('');

  // Map statuses to columns format
  const columns: KanbanStatusColumn[] = statuses.map(s => ({
    id: s.id,
    title: s.name,
    color: s.color,
  }));

  const loading = leadsLoading || statusesLoading;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || lead.payment_status === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const leadId = active.id as string;
      const newStatus = over.id as string;
      const lead = leads.find(l => l.id === leadId);
      
      if (columns.some(c => c.id === newStatus) && lead) {
        // Se mover para Concluído, marca como pago
        if (newStatus === 'closed' && lead.payment_status !== 'paid') {
          await updateLead(leadId, { status: newStatus, payment_status: 'paid' });
          toast.success('Lead movido e marcado como pago!');
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

  const handleNewLeadFromHeader = () => {
    if (columns.length === 0) {
      toast.info('Crie um status antes de adicionar leads.');
      setIsStatusModalOpen(true);
      return;
    }

    handleAddLead(columns[0].id);
  };

  const handleAddStatus = async () => {
    if (!newStatusName.trim()) return;
    
    // Check if name already exists
    if (statuses.some(s => s.name.toLowerCase() === newStatusName.toLowerCase())) {
      toast.error('Status já existe!');
      return;
    }

    try {
      await createStatus(newStatusName.trim());
      setNewStatusName('');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleDeleteStatus = async (statusId: string) => {
    // Check if there are leads in this status
    const leadsInStatus = leads.filter(l => l.status === statusId);
    if (leadsInStatus.length > 0) {
      toast.error(`Não é possível excluir: ${leadsInStatus.length} lead(s) neste status.`);
      return;
    }

    try {
      await deleteStatus(statusId);
    } catch (error) {
      // Error already handled in hook
    }
  };

  // Stats
  const stats = {
    total: leads.length,
    paid: leads.filter(l => l.payment_status === 'paid').length,
    pending: leads.filter(l => l.payment_status === 'pending' || !l.payment_status).length,
    totalValue: leads.reduce((sum, l) => sum + (l.value || 0), 0),
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Pipeline de Vendas</h1>
            <p className="text-xs lg:text-sm text-muted-foreground">
              {stats.total} leads • R$ {(stats.totalValue / 1000).toFixed(1)}k em pipeline
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsStatusModalOpen(true)}>
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Status</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsCustomerModalOpen(true)}>
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Cliente</span>
            </Button>
            <Button className="btn-primary gap-2" size="sm" onClick={handleNewLeadFromHeader}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Lead</span>
            </Button>
          </div>
        </div>


        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar leads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 input-field h-9" />
          </div>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Não Pago</SelectItem>
              <SelectItem value="partial">Parcial</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="overdue">Atrasado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex items-center justify-center py-12 flex-1">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : columns.length === 0 ? (
          <div className="flex items-center justify-center py-12 flex-1">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Nenhum status criado ainda.</p>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsStatusModalOpen(true)}>
                <Settings2 className="w-4 h-4" />
                Criar status
              </Button>
            </div>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 flex-1">
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

      {/* Status Management Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Nome do novo status..." 
                value={newStatusName} 
                onChange={(e) => setNewStatusName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddStatus}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status atuais:</p>
              {columns.length === 0 ? (
                <p className="text-xs text-muted-foreground/70 py-4 text-center">Nenhum status criado</p>
              ) : (
                columns.map((col) => (
                  <div key={col.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded-full', col.color)} />
                      <span className="text-sm text-foreground">{col.title}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteStatus(col.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => { setIsLeadModalOpen(false); setEditingLead(null); }} 
        lead={editingLead}
        defaultStatus={defaultStatus}
        availableStatuses={columns}
      />
      <CustomerModal 
        isOpen={isCustomerModalOpen} 
        onClose={() => setIsCustomerModalOpen(false)} 
      />
    </MainLayout>
  );
}