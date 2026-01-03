import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { LeadModal } from '@/components/modals/LeadModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { Plus, Search, Edit, Trash2, MessageCircle, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusLabels: Record<string, string> = {
  new: 'Novo Lead',
  contacted: 'Contato Iniciado',
  proposal: 'Proposta Enviada',
  negotiation: 'Negociação',
  waiting_payment: 'Aguardando Pagamento',
  closed: 'Venda Concluída',
  post_sale: 'Pós-venda',
  lost: 'Perdido',
};

const statusColors: Record<string, string> = {
  new: 'status-info',
  contacted: 'status-info',
  proposal: 'status-warning',
  negotiation: 'status-warning',
  waiting_payment: 'status-warning',
  closed: 'status-success',
  post_sale: 'status-success',
  lost: 'status-danger',
};

export default function LeadsPage() {
  const { leads, loading, deleteLead } = useLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<typeof leads[0] | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const filteredLeads = leads.filter(lead =>
    lead.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (lead: typeof leads[0]) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteModal.id) {
      await deleteLead(deleteModal.id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2">Leads</h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              Gerencie todos os seus leads ({leads.length})
            </p>
          </div>
          
          <Button className="btn-primary gap-2 w-full sm:w-auto" onClick={() => { setEditingLead(null); setIsModalOpen(true); }}>
            <Plus className="w-5 h-5" />
            Novo Lead
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <Button variant="outline" className="btn-secondary gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden space-y-3"
          >
            {filteredLeads.length === 0 ? (
              <div className="glass-card p-8 text-center text-muted-foreground">
                {searchQuery ? 'Nenhum lead encontrado' : 'Nenhum lead cadastrado'}
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead.id} className="glass-card-hover p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
                        {lead.customer?.name?.charAt(0) || 'L'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{lead.customer?.name || 'Sem cliente'}</p>
                        <p className="text-xs text-muted-foreground truncate">{lead.product}</p>
                      </div>
                    </div>
                    <span className={cn('status-badge text-xs', statusColors[lead.status])}>
                      {statusLabels[lead.status]?.split(' ')[0] || lead.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary text-sm">
                      R$ {lead.value.toLocaleString('pt-BR')}
                    </span>
                    <div className="flex items-center gap-2">
                      {lead.customer?.phone && (
                        <button
                          onClick={() => window.open(`https://wa.me/${lead.customer?.phone?.replace(/\D/g, '')}`, '_blank')}
                          className="p-2 rounded-lg bg-success/20 text-success"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(lead)}
                        className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, id: lead.id })}
                        className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Desktop Table */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:block glass-card overflow-hidden"
          >
            {filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery ? 'Nenhum lead encontrado' : 'Nenhum lead cadastrado'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Produto</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Valor</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data</th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                              {lead.customer?.name?.charAt(0) || 'L'}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{lead.customer?.name || 'Sem cliente'}</p>
                              {lead.customer?.company && (
                                <p className="text-xs text-muted-foreground">{lead.customer.company}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-foreground">{lead.product}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-primary">
                            R$ {lead.value.toLocaleString('pt-BR')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn('status-badge', statusColors[lead.status])}>
                            {statusLabels[lead.status] || lead.status}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">
                          {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            {lead.customer?.phone && (
                              <button
                                onClick={() => window.open(`https://wa.me/${lead.customer?.phone?.replace(/\D/g, '')}`, '_blank')}
                                className="p-2 rounded-lg bg-success/20 hover:bg-success/30 text-success transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(lead)}
                              className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, id: lead.id })}
                              className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLead(null); }}
        lead={editingLead}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Excluir Lead"
        description="Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita."
      />
    </MainLayout>
  );
}
