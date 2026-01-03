import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, useCustomers } from '@/hooks/useCustomers';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export function CustomerModal({ isOpen, onClose, customer }: CustomerModalProps) {
  const { createCustomer, updateCustomer } = useCustomers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'manual',
    notes: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        source: customer.source || 'manual',
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'manual',
        notes: '',
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (customer) {
        await updateCustomer(customer.id, formData);
      } else {
        await createCustomer(formData);
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
        className="glass-card w-full max-w-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {customer ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Nome *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field mt-1"
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input-field mt-1"
              />
            </div>

            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="input-field mt-1"
              />
            </div>

            <div>
              <Label>Empresa</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="input-field mt-1"
              />
            </div>

            <div>
              <Label>Origem</Label>
              <Select
                value={formData.source}
                onValueChange={(v) => setFormData(prev => ({ ...prev, source: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="indicacao">Indicação</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label>Notas</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="input-field mt-1"
                rows={3}
              />
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
              disabled={loading || !formData.name}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                customer ? 'Salvar' : 'Criar Cliente'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
