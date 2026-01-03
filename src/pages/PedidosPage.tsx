import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { usePayments } from '@/hooks/usePayments';
import { useMemo, useState } from 'react';
import { Package, DollarSign, Clock, CheckCircle, XCircle, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LeadModal } from '@/components/modals/LeadModal';

const statusConfig = {
  pending: { label: 'Pendente', color: 'text-warning', bg: 'bg-warning/20', icon: Clock },
  paid: { label: 'Pago', color: 'text-success', bg: 'bg-success/20', icon: CheckCircle },
  overdue: { label: 'Atrasado', color: 'text-destructive', bg: 'bg-destructive/20', icon: XCircle },
  partial: { label: 'Parcial', color: 'text-info', bg: 'bg-info/20', icon: DollarSign },
};

export default function PedidosPage() {
  const { leads, updateLead } = useLeads();
  const { payments } = usePayments();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [selectedPedido, setSelectedPedido] = useState<any>(null);

  const pedidos = useMemo(() => {
    // Leads com status closed ou waiting_payment são considerados pedidos
    let filtered = leads.filter(l => l.status === 'closed' || l.status === 'waiting_payment');

    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.product.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.payment_status === statusFilter);
    }

    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [leads, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = pedidos.length;
    const paid = pedidos.filter(p => p.payment_status === 'paid').length;
    const pending = pedidos.filter(p => p.payment_status === 'pending' || !p.payment_status).length;
    const totalValue = pedidos.reduce((sum, p) => sum + (p.value || 0), 0);
    const paidValue = pedidos.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + (p.value || 0), 0);

    return { total, paid, pending, totalValue, paidValue };
  }, [pedidos]);

  const handleNewPedido = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleEditPedido = (pedido: any) => {
    setEditingLead(pedido);
    setIsLeadModalOpen(true);
  };

  const handleMarkAsPaid = async (pedido: any) => {
    await updateLead(pedido.id, { payment_status: 'paid', status: 'closed' });
    toast.success('Pedido marcado como pago!');
    setSelectedPedido(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Pedidos</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus pedidos e pagamentos</p>
          </div>
          <Button className="btn-primary gap-2" onClick={handleNewPedido}>
            <Plus className="w-4 h-4" />
            Novo Pedido
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Pedidos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Pagos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.paid}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-muted">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Valor Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">R$ {(stats.totalValue / 1000).toFixed(1)}k</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Valor Recebido</span>
            </div>
            <p className="text-2xl font-bold text-success">R$ {(stats.paidValue / 1000).toFixed(1)}k</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar pedidos..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-10 input-field" 
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>
              Todos
            </Button>
            <Button variant={statusFilter === 'paid' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('paid')}>
              Pagos
            </Button>
            <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('pending')}>
              Pendentes
            </Button>
          </div>
        </div>

        {/* Pedidos List */}
        <div className="space-y-3">
          {pedidos.map((pedido) => {
            const status = statusConfig[pedido.payment_status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div key={pedido.id} className="glass-card p-4 hover:border-primary/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={cn('p-3 rounded-lg flex-shrink-0', status.bg)}>
                      <Package className={cn('w-5 h-5', status.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{pedido.customer?.name || 'Cliente'}</p>
                      <p className="text-sm text-muted-foreground truncate">{pedido.product}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(pedido.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">R$ {pedido.value?.toLocaleString('pt-BR')}</p>
                      <div className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', status.bg, status.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setSelectedPedido(pedido)}
                        className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditPedido(pedido)}
                        className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {pedidos.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
              <Button className="mt-4" variant="outline" onClick={handleNewPedido}>
                Criar Primeiro Pedido
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Pedido Details Modal */}
      <Dialog open={!!selectedPedido} onOpenChange={() => setSelectedPedido(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          {selectedPedido && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-semibold text-foreground">{selectedPedido.customer?.name || 'Não informado'}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Produto</p>
                <p className="font-semibold text-foreground">{selectedPedido.product}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-semibold text-primary">R$ {selectedPedido.value?.toLocaleString('pt-BR')}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={cn('font-semibold', statusConfig[selectedPedido.payment_status as keyof typeof statusConfig]?.color || 'text-warning')}>
                    {statusConfig[selectedPedido.payment_status as keyof typeof statusConfig]?.label || 'Pendente'}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="font-semibold text-foreground">
                  {format(new Date(selectedPedido.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              {selectedPedido.notes && (
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="text-foreground">{selectedPedido.notes}</p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                {selectedPedido.payment_status !== 'paid' && (
                  <Button className="flex-1 btn-primary" onClick={() => handleMarkAsPaid(selectedPedido)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Pago
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => handleEditPedido(selectedPedido)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => { setIsLeadModalOpen(false); setEditingLead(null); }} 
        lead={editingLead}
        defaultStatus="waiting_payment"
      />
    </MainLayout>
  );
}