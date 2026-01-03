import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface Activity {
  id: string;
  type: string;
  description: string;
  lead_id: string | null;
  customer_id: string | null;
  metadata: Json | null;
  created_at: string;
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error('Erro ao carregar atividades');
      console.error(error);
    } else {
      setActivities((data as Activity[]) || []);
    }
    setLoading(false);
  };

  const createActivity = async (activity: { type: string; description: string; lead_id?: string | null; customer_id?: string | null; metadata?: Json | null }) => {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar atividade:', error);
      return null;
    }

    setActivities(prev => [data as Activity, ...prev].slice(0, 50));
    return data as Activity;
  };

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel('activities-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, () => {
        fetchActivities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    activities,
    loading,
    fetchActivities,
    createActivity,
  };
}
