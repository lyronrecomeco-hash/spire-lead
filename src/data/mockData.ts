import { Lead, Customer, Task, Activity, DashboardMetrics, KanbanColumn, LeadStatus, Message, Payment } from '@/types/crm';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos.silva@email.com',
    phone: '+55 11 99999-1234',
    company: 'Tech Solutions',
    source: 'Website',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Ana Beatriz',
    email: 'ana.beatriz@email.com',
    phone: '+55 11 98888-5678',
    company: 'Marketing Pro',
    source: 'Instagram',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '3',
    name: 'Roberto Costa',
    email: 'roberto.costa@email.com',
    phone: '+55 21 97777-9012',
    source: 'Indicação',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    name: 'Mariana Oliveira',
    email: 'mariana.oliveira@email.com',
    phone: '+55 11 96666-3456',
    company: 'Design Studio',
    source: 'Google Ads',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '5',
    name: 'Pedro Santos',
    email: 'pedro.santos@email.com',
    phone: '+55 31 95555-7890',
    company: 'Consulting Plus',
    source: 'LinkedIn',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: '6',
    name: 'Julia Fernandes',
    email: 'julia.fernandes@email.com',
    phone: '+55 11 94444-2345',
    source: 'Facebook',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    customerId: '1',
    customer: mockCustomers[0],
    status: 'new',
    product: 'Plano Enterprise',
    value: 15000,
    paymentStatus: 'pending',
    lastContact: new Date('2024-01-20'),
    tags: ['enterprise', 'urgente'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'lead-2',
    customerId: '2',
    customer: mockCustomers[1],
    status: 'contacted',
    product: 'Consultoria Marketing',
    value: 8500,
    paymentStatus: 'pending',
    lastContact: new Date('2024-01-22'),
    nextFollowUp: new Date('2024-02-05'),
    tags: ['marketing'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'lead-3',
    customerId: '3',
    customer: mockCustomers[2],
    status: 'proposal',
    product: 'Desenvolvimento Web',
    value: 25000,
    paymentStatus: 'pending',
    downPayment: 5000,
    installments: 4,
    lastContact: new Date('2024-01-25'),
    tags: ['desenvolvimento', 'web'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'lead-4',
    customerId: '4',
    customer: mockCustomers[3],
    status: 'negotiation',
    product: 'Branding Completo',
    value: 12000,
    paymentStatus: 'partial',
    downPayment: 3000,
    installments: 3,
    lastContact: new Date('2024-01-28'),
    nextFollowUp: new Date('2024-02-02'),
    tags: ['design', 'branding'],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: 'lead-5',
    customerId: '5',
    customer: mockCustomers[4],
    status: 'waiting_payment',
    product: 'Consultoria Estratégica',
    value: 18000,
    paymentStatus: 'pending',
    downPayment: 6000,
    installments: 2,
    lastContact: new Date('2024-01-30'),
    tags: ['consultoria'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: 'lead-6',
    customerId: '6',
    customer: mockCustomers[5],
    status: 'closed',
    product: 'Plano Básico',
    value: 3500,
    paymentStatus: 'paid',
    lastContact: new Date('2024-02-01'),
    tags: ['básico'],
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    leadId: 'lead-1',
    customerId: '1',
    title: 'Ligar para Carlos Silva',
    description: 'Discutir detalhes do plano Enterprise',
    dueDate: new Date('2024-02-03'),
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'task-2',
    leadId: 'lead-2',
    customerId: '2',
    title: 'Enviar proposta para Ana',
    description: 'Preparar e enviar proposta de consultoria',
    dueDate: new Date('2024-02-01'),
    priority: 'urgent',
    status: 'pending',
    createdAt: new Date('2024-01-22'),
  },
  {
    id: 'task-3',
    leadId: 'lead-4',
    customerId: '4',
    title: 'Follow-up negociação Mariana',
    dueDate: new Date('2024-02-02'),
    priority: 'medium',
    status: 'in_progress',
    createdAt: new Date('2024-01-28'),
  },
  {
    id: 'task-4',
    leadId: 'lead-5',
    customerId: '5',
    title: 'Confirmar pagamento Pedro',
    description: 'Verificar se o boleto foi pago',
    dueDate: new Date('2024-01-31'),
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-01-30'),
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'lead_created',
    description: 'Novo lead criado: Julia Fernandes',
    leadId: 'lead-6',
    customerId: '6',
    createdAt: new Date('2024-01-28T10:30:00'),
  },
  {
    id: 'act-2',
    type: 'status_changed',
    description: 'Lead movido para "Proposta Enviada"',
    leadId: 'lead-3',
    customerId: '3',
    createdAt: new Date('2024-01-28T11:45:00'),
  },
  {
    id: 'act-3',
    type: 'message_sent',
    description: 'Mensagem WhatsApp enviada para Mariana',
    leadId: 'lead-4',
    customerId: '4',
    createdAt: new Date('2024-01-28T14:20:00'),
  },
  {
    id: 'act-4',
    type: 'payment_received',
    description: 'Pagamento de R$ 3.500 recebido',
    leadId: 'lead-6',
    customerId: '6',
    createdAt: new Date('2024-02-01T09:15:00'),
  },
  {
    id: 'act-5',
    type: 'task_completed',
    description: 'Tarefa concluída: Enviar contrato',
    leadId: 'lead-5',
    customerId: '5',
    createdAt: new Date('2024-02-01T16:30:00'),
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    leadId: 'lead-4',
    customerId: '4',
    content: 'Olá Mariana! Tudo bem? Gostaria de saber se teve tempo de avaliar nossa proposta.',
    type: 'outgoing',
    channel: 'whatsapp',
    read: true,
    sentAt: new Date('2024-01-28T14:20:00'),
  },
  {
    id: 'msg-2',
    leadId: 'lead-4',
    customerId: '4',
    content: 'Oi! Sim, estou analisando. Podemos conversar amanhã às 10h?',
    type: 'incoming',
    channel: 'whatsapp',
    read: true,
    sentAt: new Date('2024-01-28T14:35:00'),
  },
  {
    id: 'msg-3',
    leadId: 'lead-4',
    customerId: '4',
    content: 'Perfeito! Amanhã às 10h está ótimo. Até lá!',
    type: 'outgoing',
    channel: 'whatsapp',
    read: true,
    sentAt: new Date('2024-01-28T14:38:00'),
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    leadId: 'lead-6',
    customerId: '6',
    amount: 3500,
    type: 'full',
    dueDate: new Date('2024-02-01'),
    paidAt: new Date('2024-02-01'),
    status: 'paid',
  },
  {
    id: 'pay-2',
    leadId: 'lead-4',
    customerId: '4',
    amount: 3000,
    type: 'down_payment',
    dueDate: new Date('2024-01-30'),
    paidAt: new Date('2024-01-30'),
    status: 'paid',
  },
  {
    id: 'pay-3',
    leadId: 'lead-4',
    customerId: '4',
    amount: 3000,
    type: 'installment',
    installmentNumber: 1,
    dueDate: new Date('2024-02-28'),
    status: 'pending',
  },
  {
    id: 'pay-4',
    leadId: 'lead-5',
    customerId: '5',
    amount: 6000,
    type: 'down_payment',
    dueDate: new Date('2024-02-05'),
    status: 'pending',
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  activeLeads: 5,
  ongoingNegotiations: 2,
  closedDealsMonth: 1,
  closedDealsWeek: 1,
  pendingValue: 78500,
  overdueFollowUps: 1,
  conversionRate: 16.7,
};

export const kanbanColumns: KanbanColumn[] = [
  { id: 'new', title: 'Novo Lead', color: 'bg-info', leads: mockLeads.filter(l => l.status === 'new') },
  { id: 'contacted', title: 'Contato Iniciado', color: 'bg-primary', leads: mockLeads.filter(l => l.status === 'contacted') },
  { id: 'proposal', title: 'Proposta Enviada', color: 'bg-accent', leads: mockLeads.filter(l => l.status === 'proposal') },
  { id: 'negotiation', title: 'Negociação', color: 'bg-warning', leads: mockLeads.filter(l => l.status === 'negotiation') },
  { id: 'waiting_payment', title: 'Aguardando Pagamento', color: 'bg-warning', leads: mockLeads.filter(l => l.status === 'waiting_payment') },
  { id: 'closed', title: 'Venda Concluída', color: 'bg-success', leads: mockLeads.filter(l => l.status === 'closed') },
  { id: 'post_sale', title: 'Pós-venda', color: 'bg-success', leads: mockLeads.filter(l => l.status === 'post_sale') },
  { id: 'lost', title: 'Perdido', color: 'bg-destructive', leads: mockLeads.filter(l => l.status === 'lost') },
];

export const getStatusLabel = (status: LeadStatus): string => {
  const labels: Record<LeadStatus, string> = {
    new: 'Novo Lead',
    contacted: 'Contato Iniciado',
    proposal: 'Proposta Enviada',
    negotiation: 'Negociação',
    waiting_payment: 'Aguardando Pagamento',
    closed: 'Venda Concluída',
    post_sale: 'Pós-venda',
    lost: 'Perdido',
  };
  return labels[status];
};

export const getStatusColor = (status: LeadStatus): string => {
  const colors: Record<LeadStatus, string> = {
    new: 'status-info',
    contacted: 'status-info',
    proposal: 'status-warning',
    negotiation: 'status-warning',
    waiting_payment: 'status-warning',
    closed: 'status-success',
    post_sale: 'status-success',
    lost: 'status-danger',
  };
  return colors[status];
};

export const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    overdue: 'Atrasado',
    partial: 'Parcial',
  };
  return labels[status] || status;
};

export const getPaymentStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'status-warning',
    paid: 'status-success',
    overdue: 'status-danger',
    partial: 'status-info',
  };
  return colors[status] || 'status-neutral';
};
