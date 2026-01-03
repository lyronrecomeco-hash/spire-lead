import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads, Lead } from '@/hooks/useLeads';
import { useCustomers } from '@/hooks/useCustomers';

interface StatusColumn {
  id: string;
  title: string;
}

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  defaultStatus?: string;
  availableStatuses?: StatusColumn[];
}

export function LeadModal({ isOpen, onClose, lead, defaultStatus = '', availableStatuses = [] }: LeadModalProps) {
  const { createLead, updateLead } = useLeads();
  const { customers } = useCustomers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    product: '',
    value: '',
    status: defaultStatus,
    payment_status: 'pending',
    down_payment: '',
    installments: '',
    notes: '',
    tags: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        customer_id: lead.customer_id || '',
        product: lead.product || '',
        value: lead.value?.toString() || '',
        status: lead.status || 'new',
        payment_status: lead.payment_status || 'pending',
        down_payment: lead.down_payment?.toString() || '',
        installments: lead.installments?.toString() || '',
        notes: lead.notes || '',
        tags: lead.tags?.join(', ') || '',
      });
    } else {
      setFormData({
        customer_id: '',
        product: '',
        value: '',
        status: defaultStatus,
        payment_status: 'pending',
        down_payment: '',
        installments: '',
        notes: '',
        tags: '',
      });
    }
  }, [lead, defaultStatus, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const leadData = {
      customer_id: formData.customer_id || null,
      product: formData.product,
      value: parseFloat(formData.value) || 0,
      status: formData.status,
      payment_status: formData.payment_status,
      down_payment: formData.down_payment ? parseFloat(formData.down_payment) : null,
      installments: formData.installments ? parseInt(formData.installments) : null,
      notes: formData.notes || null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
    };

    try {
      if (lead) {
        await updateLead(lead.id, leadData);
      } else {
        await createLead(leadData);
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Select
              value={formData.customer_id}
              onValueChange={(v) => setFormData(prev => ({ ...prev, customer_id: v }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Produto/Serviço *</Label>
            <Input
              value={formData.product}
              onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
              className="input-field mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Valor (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                className="input-field mt-1"
                required
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.length > 0 ? (
                    availableStatuses.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value={formData.status || 'default'}>{formData.status || 'Sem status'}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Entrada (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.down_payment}
                onChange={(e) => setFormData(prev => ({ ...prev, down_payment: e.target.value }))}
                className="input-field mt-1"
              />
            </div>

            <div>
              <Label>Parcelas</Label>
              <Input
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData(prev => ({ ...prev, installments: e.target.value }))}
                className="input-field mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Status de Pagamento</Label>
            <Select
              value={formData.payment_status}
              onValueChange={(v) => setFormData(prev => ({ ...prev, payment_status: v }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="partial">Parcial</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tags (separadas por vírgula)</Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="input-field mt-1"
              placeholder="ex: urgente, enterprise, prioridade"
            />
          </div>

          <div>
            <Label>Notas</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="input-field mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading || !formData.product || !formData.value}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                lead ? 'Salvar' : 'Criar Lead'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
