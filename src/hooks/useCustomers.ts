import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  avatar_url: string | null;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar clientes');
      console.error(error);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  const createCustomer = async (customer: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>> & { name: string }) => {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar cliente');
      throw error;
    }

    setCustomers(prev => [data, ...prev]);
    toast.success('Cliente criado com sucesso!');
    return data;
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar cliente');
      throw error;
    }

    setCustomers(prev => prev.map(c => c.id === id ? data : c));
    toast.success('Cliente atualizado!');
    return data;
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir cliente');
      throw error;
    }

    setCustomers(prev => prev.filter(c => c.id !== id));
    toast.success('Cliente excluído!');
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
