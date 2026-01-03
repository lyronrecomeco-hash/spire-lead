import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { usePayments } from '@/hooks/usePayments';
import { useMemo, useState } from 'react';
import { Package, DollarSign, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pendente', color: 'text-warning', bg: 'bg-warning/20', icon: Clock },
  paid: { label: 'Pago', color: 'text-success', bg: 'bg-success/20', icon: CheckCircle },
  overdue: { label: 'Atrasado', color: 'text-destructive', bg: 'bg-destructive/20', icon: XCircle },
  partial: { label: 'Parcial', color: 'text-info', bg: 'bg-info/20', icon: DollarSign },
};

export default function PedidosPage() {
  const { leads } = useLeads();
  const { payments } = usePayments();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
    const pending = pedidos.filter(p => p.payment_status === 'pending').length;
    const totalValue = pedidos.reduce((sum, p) => sum + (p.value || 0), 0);
    const paidValue = pedidos.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + (p.value || 0), 0);

    return { total, paid, pending, totalValue, paidValue };
  }, [pedidos]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Pedidos</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus pedidos e pagamentos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="p-2 rounded-lg bg-success/20">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Valor Recebido</span>
            </div>
            <p className="text-2xl font-bold text-foreground">R$ {(stats.paidValue / 1000).toFixed(1)}k</p>
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
              <div key={pedido.id} className="glass-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={cn('p-3 rounded-lg', status.bg)}>
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
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-bold text-foreground">R$ {pedido.value?.toLocaleString('pt-BR')}</p>
                    <div className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', status.bg, status.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {pedidos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum pedido encontrado
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
