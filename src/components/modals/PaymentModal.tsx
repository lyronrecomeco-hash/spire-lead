import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePayments, Payment } from '@/hooks/usePayments';
import { useCustomers } from '@/hooks/useCustomers';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment | null;
}

export function PaymentModal({ isOpen, onClose, payment }: PaymentModalProps) {
  const { createPayment, updatePayment } = usePayments();
  const { customers } = useCustomers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: payment?.customer_id || '',
    amount: payment?.amount?.toString() || '',
    type: payment?.type || 'full',
    installment_number: payment?.installment_number?.toString() || '',
    due_date: payment?.due_date ? new Date(payment.due_date).toISOString().split('T')[0] : '',
    status: payment?.status || 'pending',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const paymentData = {
      customer_id: formData.customer_id || null,
      lead_id: payment?.lead_id || null,
      amount: parseFloat(formData.amount) || 0,
      type: formData.type,
      installment_number: formData.installment_number ? parseInt(formData.installment_number) : null,
      due_date: new Date(formData.due_date).toISOString(),
      status: formData.status,
      paid_at: formData.status === 'paid' ? new Date().toISOString() : null,
    };

    try {
      if (payment) {
        await updatePayment(payment.id, paymentData);
      } else {
        await createPayment(paymentData);
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-lg p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {payment ? 'Editar Pagamento' : 'Novo Pagamento'}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Pagamento Integral</SelectItem>
                    <SelectItem value="down_payment">Entrada</SelectItem>
                    <SelectItem value="installment">Parcela</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'installment' && (
                <div>
                  <Label>Número da Parcela</Label>
                  <Input
                    type="number"
                    value={formData.installment_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, installment_number: e.target.value }))}
                    className="input-field mt-1"
                  />
                </div>
              )}

              <div>
                <Label>Data de Vencimento *</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
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
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                disabled={loading || !formData.amount || !formData.due_date}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  payment ? 'Salvar' : 'Criar Pagamento'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
