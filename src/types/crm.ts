export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'proposal'
  | 'negotiation'
  | 'waiting_payment'
  | 'closed'
  | 'post_sale'
  | 'lost';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  avatar?: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  customerId: string;
  customer: Customer;
  status: LeadStatus;
  product: string;
  value: number;
  paymentStatus: PaymentStatus;
  downPayment?: number;
  installments?: number;
  lastContact?: Date;
  nextFollowUp?: Date;
  assignedTo?: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  leadId?: string;
  customerId?: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  leadId: string;
  customerId: string;
  content: string;
  type: 'incoming' | 'outgoing' | 'system';
  channel: 'whatsapp' | 'email' | 'internal';
  read: boolean;
  sentAt: Date;
}

export interface Payment {
  id: string;
  leadId: string;
  customerId: string;
  amount: number;
  type: 'down_payment' | 'installment' | 'full';
  installmentNumber?: number;
  dueDate: Date;
  paidAt?: Date;
  status: PaymentStatus;
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  color: string;
  leads: Lead[];
}

export interface DashboardMetrics {
  activeLeads: number;
  ongoingNegotiations: number;
  closedDealsMonth: number;
  closedDealsWeek: number;
  pendingValue: number;
  overdueFollowUps: number;
  conversionRate: number;
}

export interface Activity {
  id: string;
  type: 'lead_created' | 'status_changed' | 'message_sent' | 'payment_received' | 'task_completed' | 'note_added';
  description: string;
  leadId?: string;
  customerId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
