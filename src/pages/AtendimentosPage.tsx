import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { useCustomers } from '@/hooks/useCustomers';
import { useMemo, useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, User, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AtendimentosPage() {
  const { leads } = useLeads();
  const { customers } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'today'>('all');

  const atendimentos = useMemo(() => {
    let filtered = leads.filter(lead => lead.customer);
    
    if (searchQuery) {
      filtered = filtered.filter(lead => 
        lead.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.product.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'pending') {
      filtered = filtered.filter(lead => !lead.last_contact || lead.status === 'new');
    } else if (filter === 'today') {
      const today = format(new Date(), 'yyyy-MM-dd');
      filtered = filtered.filter(lead => {
        if (!lead.last_contact) return false;
        return format(new Date(lead.last_contact), 'yyyy-MM-dd') === today;
      });
    }

    return filtered.sort((a, b) => {
      const dateA = a.last_contact ? new Date(a.last_contact).getTime() : 0;
      const dateB = b.last_contact ? new Date(b.last_contact).getTime() : 0;
      return dateB - dateA;
    });
  }, [leads, searchQuery, filter]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Atendimentos</h1>
            <p className="text-muted-foreground text-sm">Gerencie os contatos com seus leads</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar atendimentos..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-10 input-field" 
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendentes
            </Button>
            <Button 
              variant={filter === 'today' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('today')}
            >
              Hoje
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{atendimentos.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-warning">{leads.filter(l => !l.last_contact).length}</p>
            <p className="text-sm text-muted-foreground">Sem Contato</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-success">{leads.filter(l => l.last_contact).length}</p>
            <p className="text-sm text-muted-foreground">Contatados</p>
          </div>
        </div>

        {/* Atendimentos List */}
        <div className="space-y-3">
          {atendimentos.map((lead) => (
            <div key={lead.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{lead.customer?.name || 'Cliente não identificado'}</p>
                    <p className="text-sm text-muted-foreground truncate">{lead.product}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {lead.customer?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.customer.phone}
                        </span>
                      )}
                      {lead.customer?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.customer.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {lead.last_contact 
                      ? formatDistanceToNow(new Date(lead.last_contact), { addSuffix: true, locale: ptBR })
                      : 'Sem contato'
                    }
                  </div>
                  <div className="flex gap-2">
                    {lead.customer?.phone && (
                      <button
                        onClick={() => window.open(`https://wa.me/${lead.customer?.phone?.replace(/\D/g, '')}`, '_blank')}
                        className="p-2 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                    {lead.customer?.phone && (
                      <button
                        onClick={() => window.open(`tel:${lead.customer?.phone}`, '_blank')}
                        className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {atendimentos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum atendimento encontrado
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
