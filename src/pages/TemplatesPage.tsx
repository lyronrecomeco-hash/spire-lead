import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';
import { FileText, MessageCircle, Mail, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  category: 'whatsapp' | 'email' | 'outros';
  content: string;
}

const defaultTemplates: Template[] = [
  {
    id: '1',
    name: 'Boas-vindas',
    category: 'whatsapp',
    content: 'Olá {nome}! Seja bem-vindo(a) à nossa empresa. Estou à disposição para ajudá-lo(a) no que precisar. 🙌',
  },
  {
    id: '2',
    name: 'Follow-up Proposta',
    category: 'whatsapp',
    content: 'Olá {nome}, tudo bem? Gostaria de saber se teve a oportunidade de analisar nossa proposta. Fico no aguardo do seu retorno! 📋',
  },
  {
    id: '3',
    name: 'Confirmação de Pagamento',
    category: 'email',
    content: 'Prezado(a) {nome},\n\nConfirmamos o recebimento do seu pagamento no valor de R$ {valor}.\n\nAgradecemos a preferência!\n\nAtenciosamente,\nEquipe Genesis',
  },
  {
    id: '4',
    name: 'Lembrete de Reunião',
    category: 'whatsapp',
    content: 'Olá {nome}! 👋 Só passando para lembrar da nossa reunião amanhã às {horario}. Confirma sua presença? ✅',
  },
  {
    id: '5',
    name: 'Proposta Comercial',
    category: 'email',
    content: 'Prezado(a) {nome},\n\nSegue em anexo nossa proposta comercial conforme conversado.\n\nValor: R$ {valor}\nCondições: {condicoes}\n\nFicamos à disposição para esclarecer qualquer dúvida.\n\nAtenciosamente,\nEquipe Genesis',
  },
];

const categoryConfig = {
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, color: 'text-success', bg: 'bg-success/20' },
  email: { label: 'E-mail', icon: Mail, color: 'text-info', bg: 'bg-info/20' },
  outros: { label: 'Outros', icon: FileText, color: 'text-muted-foreground', bg: 'bg-muted' },
};

export default function TemplatesPage() {
  const [templates] = useState<Template[]>(defaultTemplates);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with disabled notice */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Templates</h1>
            <p className="text-muted-foreground text-sm">Mensagens prontas para agilizar seu atendimento</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/10 border border-warning/30">
            <Lock className="w-4 h-4 text-warning" />
            <span className="text-sm text-warning font-medium">Módulo em Desenvolvimento</span>
          </div>
        </div>

        {/* Disabled overlay notification */}
        <div className="glass-card p-6 text-center border-2 border-dashed border-muted-foreground/30">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Funcionalidade Temporariamente Indisponível</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            O módulo de Templates está em desenvolvimento e estará disponível em breve. 
            Visualize abaixo exemplos dos templates que poderão ser utilizados.
          </p>
        </div>

        {/* Stats - Disabled */}
        <div className="grid grid-cols-3 gap-4 opacity-60 pointer-events-none select-none">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{templates.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-success">{templates.filter(t => t.category === 'whatsapp').length}</p>
            <p className="text-sm text-muted-foreground">WhatsApp</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-info">{templates.filter(t => t.category === 'email').length}</p>
            <p className="text-sm text-muted-foreground">E-mail</p>
          </div>
        </div>

        {/* Templates Grid - Disabled */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-60 pointer-events-none select-none">
          {templates.map((template) => {
            const config = categoryConfig[template.category];
            const Icon = config.icon;

            return (
              <div key={template.id} className="glass-card p-4 relative">
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', config.bg)}>
                      <Icon className={cn('w-4 h-4', config.color)} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{template.name}</p>
                      <span className={cn('text-xs', config.color)}>{config.label}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">{template.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}