import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { LeadDetailModal } from '@/components/leads/LeadDetailModal';
import { kanbanColumns, mockLeads } from '@/data/mockData';
import { Lead, LeadStatus } from '@/types/crm';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KanbanPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  const selectedLead = selectedLeadId 
    ? mockLeads.find(l => l.id === selectedLeadId) ?? null
    : null;

  const handleLeadMove = (leadId: string, newStatus: LeadStatus) => {
    console.log(`Lead ${leadId} movido para ${newStatus}`);
    // Aqui você implementaria a lógica de persistência
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-8rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Pipeline de Vendas</h1>
            <p className="text-muted-foreground">
              Gerencie suas negociações arrastando os cards entre as colunas
            </p>
          </div>
          
          <Button className="btn-primary gap-2">
            <Plus className="w-5 h-5" />
            Novo Lead
          </Button>
        </motion.div>

        {/* Kanban Board */}
        <KanbanBoard
          columns={kanbanColumns}
          onLeadMove={handleLeadMove}
          onCardClick={setSelectedLeadId}
        />

        {/* Lead Detail Modal */}
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLeadId(null)}
        />
      </div>
    </MainLayout>
  );
}
