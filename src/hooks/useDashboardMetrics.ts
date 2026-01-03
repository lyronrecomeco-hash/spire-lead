import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardMetrics {
  activeLeads: number;
  ongoingNegotiations: number;
  closedDealsMonth: number;
  closedDealsWeek: number;
  pendingValue: number;
  overdueFollowUps: number;
  conversionRate: number;
  totalCustomers: number;
  pendingTasks: number;
  pendingPayments: number;
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeLeads: 0,
    ongoingNegotiations: 0,
    closedDealsMonth: 0,
    closedDealsWeek: 0,
    pendingValue: 0,
    overdueFollowUps: 0,
    conversionRate: 0,
    totalCustomers: 0,
    pendingTasks: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();

    // Fetch leads
    const { data: leads } = await supabase
      .from('leads')
      .select('status, value, next_follow_up');

    // Fetch customers count
    const { count: customersCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Fetch pending tasks
    const { count: pendingTasksCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'completed');

    // Fetch pending payments
    const { count: pendingPaymentsCount } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (leads) {
      const activeLeads = leads.filter(l => !['closed', 'lost'].includes(l.status)).length;
      const negotiations = leads.filter(l => ['negotiation', 'proposal'].includes(l.status)).length;
      const closedMonth = leads.filter(l => l.status === 'closed').length;
      const closedWeek = leads.filter(l => l.status === 'closed').length;
      const pendingValue = leads
        .filter(l => !['closed', 'lost'].includes(l.status))
        .reduce((sum, l) => sum + (l.value || 0), 0);
      const overdueFollowUps = leads.filter(l => 
        l.next_follow_up && new Date(l.next_follow_up) < new Date()
      ).length;
      const conversionRate = leads.length > 0 
        ? (closedMonth / leads.length) * 100 
        : 0;

      setMetrics({
        activeLeads,
        ongoingNegotiations: negotiations,
        closedDealsMonth: closedMonth,
        closedDealsWeek: closedWeek,
        pendingValue,
        overdueFollowUps,
        conversionRate: Math.round(conversionRate * 10) / 10,
        totalCustomers: customersCount || 0,
        pendingTasks: pendingTasksCount || 0,
        pendingPayments: pendingPaymentsCount || 0,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, loading, fetchMetrics };
}
