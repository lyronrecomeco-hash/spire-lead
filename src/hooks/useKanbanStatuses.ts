import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface KanbanStatus {
  id: string;
  name: string;
  color: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export function useKanbanStatuses() {
  const [statuses, setStatuses] = useState<KanbanStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatuses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('kanban_statuses')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar status');
      console.error(error);
    } else {
      setStatuses(data || []);
    }
    setLoading(false);
  };

  const createStatus = async (name: string, color: string = 'bg-muted-foreground') => {
    const position = statuses.length;
    
    const { data, error } = await supabase
      .from('kanban_statuses')
      .insert({ name, color, position })
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar status');
      throw error;
    }

    setStatuses(prev => [...prev, data]);
    toast.success('Status criado!');
    return data;
  };

  const updateStatus = async (id: string, updates: Partial<Pick<KanbanStatus, 'name' | 'color' | 'position'>>) => {
    const { data, error } = await supabase
      .from('kanban_statuses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar status');
      throw error;
    }

    setStatuses(prev => prev.map(s => s.id === id ? data : s));
    return data;
  };

  const deleteStatus = async (id: string) => {
    const { error } = await supabase
      .from('kanban_statuses')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir status');
      throw error;
    }

    setStatuses(prev => prev.filter(s => s.id !== id));
    toast.success('Status excluído!');
  };

  const reorderStatuses = async (reorderedStatuses: KanbanStatus[]) => {
    // Update positions locally first
    setStatuses(reorderedStatuses);

    // Update in database
    const updates = reorderedStatuses.map((status, index) => 
      supabase
        .from('kanban_statuses')
        .update({ position: index })
        .eq('id', status.id)
    );

    await Promise.all(updates);
  };

  useEffect(() => {
    fetchStatuses();

    // Realtime subscription
    const channel = supabase
      .channel('kanban-statuses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kanban_statuses' }, () => {
        fetchStatuses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    statuses,
    loading,
    fetchStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
  };
}
