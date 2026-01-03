import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Payment {
  id: string;
  lead_id: string | null;
  customer_id: string | null;
  amount: number;
  type: string;
  installment_number: number | null;
  due_date: string;
  paid_at: string | null;
  status: string;
  created_at: string;
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar pagamentos');
      console.error(error);
    } else {
      setPayments(data || []);
    }
    setLoading(false);
  };

  const createPayment = async (payment: Omit<Payment, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar pagamento');
      throw error;
    }

    setPayments(prev => [...prev, data]);
    toast.success('Pagamento criado com sucesso!');
    return data;
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar pagamento');
      throw error;
    }

    setPayments(prev => prev.map(p => p.id === id ? data : p));
    toast.success('Pagamento atualizado!');
    return data;
  };

  const deletePayment = async (id: string) => {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir pagamento');
      throw error;
    }

    setPayments(prev => prev.filter(p => p.id !== id));
    toast.success('Pagamento excluído!');
  };

  const markAsPaid = async (id: string) => {
    return updatePayment(id, { 
      status: 'paid', 
      paid_at: new Date().toISOString() 
    });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
  };
}
