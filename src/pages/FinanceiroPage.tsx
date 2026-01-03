import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockPayments, mockCustomers, getPaymentStatusLabel, getPaymentStatusColor } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function FinanceiroPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const today = startOfDay(new Date());

  const payments = mockPayments.map(p => ({
    ...p,
    customer: mockCustomers.find(c => c.id === p.customerId),
  }));

  const totalReceived = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter(p => p.status === 'pending' && isBefore(p.dueDate, today))
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe pagamentos e valores
          </p>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-success/20">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <p className="text-muted-foreground text-sm mb-1">Recebido</p>
            <p className="text-3xl font-bold text-success">
              R$ {totalReceived.toLocaleString('pt-BR')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">Pendente</p>
            <p className="text-3xl font-bold text-warning">
              R$ {totalPending.toLocaleString('pt-BR')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-destructive/20">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
              <ArrowDownRight className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-muted-foreground text-sm mb-1">Em Atraso</p>
            <p className="text-3xl font-bold text-destructive">
              R$ {totalOverdue.toLocaleString('pt-BR')}
            </p>
          </motion.div>
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar pagamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <Button variant="outline" className="btn-secondary gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          
          <Button variant="outline" className="btn-secondary gap-2">
            <Calendar className="w-4 h-4" />
            Período
          </Button>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">
                    Cliente
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">
                    Tipo
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">
                    Valor
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">
                    Vencimento
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => {
                  const isOverdue = payment.status === 'pending' && isBefore(payment.dueDate, today);
                  
                  return (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                            {payment.customer?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {payment.customer?.name}
                            </p>
                            {payment.customer?.company && (
                              <p className="text-xs text-muted-foreground">
                                {payment.customer.company}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {payment.type === 'down_payment' && 'Entrada'}
                        {payment.type === 'installment' && `Parcela ${payment.installmentNumber}`}
                        {payment.type === 'full' && 'Integral'}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-foreground">
                          R$ {payment.amount.toLocaleString('pt-BR')}
                        </span>
                      </td>
                      <td className={cn(
                        'p-4',
                        isOverdue ? 'text-destructive' : 'text-muted-foreground'
                      )}>
                        {format(payment.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'status-badge',
                          isOverdue ? 'status-danger' : getPaymentStatusColor(payment.status)
                        )}>
                          {isOverdue ? 'Atrasado' : getPaymentStatusLabel(payment.status)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
