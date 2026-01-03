import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Task {
  id: string;
  lead_id: string | null;
  customer_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
  completed_at: string | null;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar tarefas');
      console.error(error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'completed_at'>) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar tarefa');
      throw error;
    }

    setTasks(prev => [...prev, data].sort((a, b) => 
      new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    ));
    toast.success('Tarefa criada com sucesso!');
    return data;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar tarefa');
      throw error;
    }

    setTasks(prev => prev.map(t => t.id === id ? data : t));
    toast.success('Tarefa atualizada!');
    return data;
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir tarefa');
      throw error;
    }

    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success('Tarefa excluída!');
  };

  const completeTask = async (id: string) => {
    return updateTask(id, { 
      status: 'completed', 
      completed_at: new Date().toISOString() 
    });
  };

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };
}
