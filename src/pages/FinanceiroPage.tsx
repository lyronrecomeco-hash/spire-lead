import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePayments } from '@/hooks/usePayments';
import { useCustomers } from '@/hooks/useCustomers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = { pending: 'Pendente', paid: 'Pago', overdue: 'Atrasado', partial: 'Parcial' };
  return labels[status] || status;
};

const getPaymentStatusColor = (status: string): string => {
  const colors: Record<string, string> = { pending: 'status-warning', paid: 'status-success', overdue: 'status-danger', partial: 'status-info' };
  return colors[status] || 'status-neutral';
};

export default function FinanceiroPage() {
  const { payments, loading } = usePayments();
  const { customers } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const today = startOfDay(new Date());

  const paymentsWithCustomer = payments.map(p => ({
    ...p,
    customer: customers.find(c => c.id === p.customer_id),
  }));

  const totalReceived = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'pending' && isBefore(new Date(p.due_date), today)).reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-4 lg:space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2">Financeiro</h1>
          <p className="text-muted-foreground text-sm lg:text-base">Acompanhe pagamentos e valores</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 rounded-xl bg-success/20"><TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-success" /></div>
              <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 text-success" />
            </div>
            <p className="text-muted-foreground text-xs lg:text-sm mb-1">Recebido</p>
            <p className="text-xl lg:text-3xl font-bold text-success">R$ {totalReceived.toLocaleString('pt-BR')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 rounded-xl bg-warning/20"><DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-warning" /></div>
            </div>
            <p className="text-muted-foreground text-xs lg:text-sm mb-1">Pendente</p>
            <p className="text-xl lg:text-3xl font-bold text-warning">R$ {totalPending.toLocaleString('pt-BR')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 rounded-xl bg-destructive/20"><TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-destructive" /></div>
              <ArrowDownRight className="w-4 h-4 lg:w-5 lg:h-5 text-destructive" />
            </div>
            <p className="text-muted-foreground text-xs lg:text-sm mb-1">Em Atraso</p>
            <p className="text-xl lg:text-3xl font-bold text-destructive">R$ {totalOverdue.toLocaleString('pt-BR')}</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="text" placeholder="Buscar pagamentos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 input-field" />
          </div>
          <Button variant="outline" className="btn-secondary gap-2"><Filter className="w-4 h-4" />Filtros</Button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-3 lg:p-4 text-muted-foreground font-medium text-xs lg:text-sm">Cliente</th>
                    <th className="text-left p-3 lg:p-4 text-muted-foreground font-medium text-xs lg:text-sm hidden sm:table-cell">Tipo</th>
                    <th className="text-left p-3 lg:p-4 text-muted-foreground font-medium text-xs lg:text-sm">Valor</th>
                    <th className="text-left p-3 lg:p-4 text-muted-foreground font-medium text-xs lg:text-sm hidden sm:table-cell">Vencimento</th>
                    <th className="text-left p-3 lg:p-4 text-muted-foreground font-medium text-xs lg:text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsWithCustomer.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum pagamento encontrado</td></tr>
                  ) : paymentsWithCustomer.map((payment) => {
                    const isOverdue = payment.status === 'pending' && isBefore(new Date(payment.due_date), today);
                    return (
                      <tr key={payment.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-3 lg:p-4">
                          <p className="font-medium text-foreground text-sm">{payment.customer?.name || 'Cliente'}</p>
                        </td>
                        <td className="p-3 lg:p-4 text-muted-foreground text-sm hidden sm:table-cell">
                          {payment.type === 'down_payment' ? 'Entrada' : payment.type === 'installment' ? `Parcela ${payment.installment_number}` : 'Integral'}
                        </td>
                        <td className="p-3 lg:p-4"><span className="font-semibold text-foreground text-sm">R$ {payment.amount.toLocaleString('pt-BR')}</span></td>
                        <td className={cn('p-3 lg:p-4 text-sm hidden sm:table-cell', isOverdue ? 'text-destructive' : 'text-muted-foreground')}>
                          {format(new Date(payment.due_date), "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                        <td className="p-3 lg:p-4">
                          <span className={cn('status-badge text-xs', isOverdue ? 'status-danger' : getPaymentStatusColor(payment.status))}>
                            {isOverdue ? 'Atrasado' : getPaymentStatusLabel(payment.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
