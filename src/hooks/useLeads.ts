import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Lead {
  id: string;
  customer_id: string | null;
  status: string;
  product: string;
  value: number;
  payment_status: string | null;
  down_payment: number | null;
  installments: number | null;
  last_contact: string | null;
  next_follow_up: string | null;
  assigned_to: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  customer?: Customer | null;
}

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

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        customer:customers(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar leads');
      console.error(error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const createLead = async (lead: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'customer'>> & { product: string }) => {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select(`*, customer:customers(*)`)
      .single();

    if (error) {
      toast.error('Erro ao criar lead');
      throw error;
    }

    setLeads(prev => [data, ...prev]);
    toast.success('Lead criado com sucesso!');
    return data;
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select(`*, customer:customers(*)`)
      .single();

    if (error) {
      toast.error('Erro ao atualizar lead');
      throw error;
    }

    setLeads(prev => prev.map(l => l.id === id ? data : l));
    toast.success('Lead atualizado!');
    return data;
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir lead');
      throw error;
    }

    setLeads(prev => prev.filter(l => l.id !== id));
    toast.success('Lead excluído!');
  };

  const updateLeadStatus = async (id: string, status: string) => {
    return updateLead(id, { status });
  };

  useEffect(() => {
    fetchLeads();

    // Realtime subscription
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    leads,
    loading,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    updateLeadStatus,
  };
}
