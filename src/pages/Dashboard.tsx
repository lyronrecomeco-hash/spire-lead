import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { PipelineChart } from '@/components/dashboard/PipelineChart';
import { ConversionChart } from '@/components/dashboard/ConversionChart';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { mockDashboardMetrics, mockActivities, mockTasks } from '@/data/mockData';
import {
  Users,
  Handshake,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Target,
} from 'lucide-react';

export default function Dashboard() {
  const metrics = mockDashboardMetrics;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas operações de vendas
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Leads Ativos"
            value={metrics.activeLeads}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Negociações"
            value={metrics.ongoingNegotiations}
            icon={Handshake}
            variant="warning"
          />
          <MetricCard
            title="Vendas (Mês)"
            value={metrics.closedDealsMonth}
            icon={TrendingUp}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Valores Pendentes"
            value={`R$ ${(metrics.pendingValue / 1000).toFixed(0)}k`}
            icon={DollarSign}
            variant="default"
          />
          <MetricCard
            title="Follow-ups Atrasados"
            value={metrics.overdueFollowUps}
            icon={AlertCircle}
            variant="danger"
          />
          <MetricCard
            title="Taxa de Conversão"
            value={`${metrics.conversionRate}%`}
            icon={Target}
            variant="success"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PipelineChart />
          <ConversionChart />
        </div>

        {/* Activities & Tasks Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed activities={mockActivities} />
          <UpcomingTasks tasks={mockTasks} />
        </div>
      </div>
    </MainLayout>
  );
}
