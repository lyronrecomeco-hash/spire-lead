import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </motion.div>
      </div>
    </MainLayout>
  );
}

export function LeadsPage() {
  return (
    <PlaceholderPage
      title="Leads"
      description="Página de gerenciamento de leads em desenvolvimento"
    />
  );
}

export function WhatsAppPage() {
  return (
    <PlaceholderPage
      title="WhatsApp"
      description="Integração com WhatsApp em desenvolvimento"
    />
  );
}

export function RelatoriosPage() {
  return (
    <PlaceholderPage
      title="Relatórios"
      description="Relatórios e análises em desenvolvimento"
    />
  );
}

export function AutomacoesPage() {
  return (
    <PlaceholderPage
      title="Automações"
      description="Automações de vendas em desenvolvimento"
    />
  );
}

export function ConfiguracoesPage() {
  return (
    <PlaceholderPage
      title="Configurações"
      description="Configurações do sistema em desenvolvimento"
    />
  );
}
