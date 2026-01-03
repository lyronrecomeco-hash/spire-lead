import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, Message } from '@/types/crm';
import { mockMessages, mockPayments, getStatusLabel, getStatusColor, getPaymentStatusLabel, getPaymentStatusColor } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  X,
  User,
  MessageCircle,
  DollarSign,
  CheckSquare,
  Phone,
  Mail,
  Building,
  Calendar,
  Tag,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!lead) return null;

  const messages = mockMessages.filter(m => m.leadId === lead.id);
  const payments = mockPayments.filter(p => p.leadId === lead.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {lead.customer.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{lead.customer.name}</h2>
                {lead.customer.company && (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {lead.customer.company}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn('status-badge', getStatusColor(lead.status))}>
                    {getStatusLabel(lead.status)}
                  </span>
                  <span className={cn('status-badge', getPaymentStatusColor(lead.paymentStatus))}>
                    {getPaymentStatusLabel(lead.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="btn-secondary gap-2">
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="w-full justify-start px-6 py-2 border-b border-border/50 bg-transparent">
              <TabsTrigger value="overview" className="gap-2">
                <User className="w-4 h-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Conversas
              </TabsTrigger>
              <TabsTrigger value="financial" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Negociação
              </TabsTrigger>
              <TabsTrigger value="activities" className="gap-2">
                <CheckSquare className="w-4 h-4" />
                Atividades
              </TabsTrigger>
            </TabsList>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <TabsContent value="overview" className="m-0">
                <div className="grid grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground mb-4">Informações de Contato</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <span>{lead.customer.phone}</span>
                        <button 
                          className="ml-auto p-2 rounded-lg bg-success/20 hover:bg-success/30 text-success transition-colors"
                          onClick={() => window.open(`https://wa.me/${lead.customer.phone.replace(/\D/g, '')}`, '_blank')}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span>{lead.customer.email}</span>
                        <button className="ml-auto p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <span>Cliente desde {format(lead.customer.createdAt, "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deal Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground mb-4">Detalhes da Negociação</h3>
                    <div className="glass-card p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Produto/Serviço</span>
                        <span className="font-medium">{lead.product}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor Total</span>
                        <span className="font-bold text-primary text-lg">
                          R$ {lead.value.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      {lead.downPayment && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada</span>
                          <span className="font-medium">
                            R$ {lead.downPayment.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      )}
                      {lead.installments && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Parcelas</span>
                          <span className="font-medium">{lead.installments}x</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Origem</span>
                        <span className="font-medium">{lead.customer.source}</span>
                      </div>
                    </div>

                    {lead.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {lead.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="messages" className="m-0">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma mensagem registrada</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'max-w-[80%] p-4 rounded-2xl',
                          message.type === 'outgoing'
                            ? 'ml-auto bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted rounded-bl-sm'
                        )}
                      >
                        <p>{message.content}</p>
                        <p className={cn(
                          'text-xs mt-2',
                          message.type === 'outgoing' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {format(message.sentAt, "dd/MM HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="financial" className="m-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="glass-card p-4 text-center">
                      <p className="text-muted-foreground text-sm mb-1">Total</p>
                      <p className="text-2xl font-bold text-foreground">
                        R$ {lead.value.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-muted-foreground text-sm mb-1">Pago</p>
                      <p className="text-2xl font-bold text-success">
                        R$ {payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-muted-foreground text-sm mb-1">Pendente</p>
                      <p className="text-2xl font-bold text-warning">
                        R$ {payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-semibold mt-6 mb-4">Histórico de Pagamentos</h3>
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                      >
                        <div>
                          <p className="font-medium">
                            {payment.type === 'down_payment' && 'Entrada'}
                            {payment.type === 'installment' && `Parcela ${payment.installmentNumber}`}
                            {payment.type === 'full' && 'Pagamento Integral'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Vencimento: {format(payment.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ {payment.amount.toLocaleString('pt-BR')}</p>
                          <span className={cn('status-badge', getPaymentStatusColor(payment.status))}>
                            {getPaymentStatusLabel(payment.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="m-0">
                <div className="text-center py-12 text-muted-foreground">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Implementar lista de atividades e tarefas</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
