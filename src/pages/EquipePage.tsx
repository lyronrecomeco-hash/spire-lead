import { MainLayout } from '@/components/layout/MainLayout';
import { useLeads } from '@/hooks/useLeads';
import { useTasks } from '@/hooks/useTasks';
import { useMemo, useState } from 'react';
import { User, Target, CheckCircle, DollarSign, TrendingUp, Award, Plus, Edit, Trash2, Mail, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

export default function EquipePage() {
  const { leads } = useLeads();
  const { tasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'João Silva', email: 'joao@genesis.com', phone: '(11) 99999-0001', role: 'Gerente de Vendas' },
    { id: '2', name: 'Maria Santos', email: 'maria@genesis.com', phone: '(11) 99999-0002', role: 'Vendedor' },
    { id: '3', name: 'Carlos Oliveira', email: 'carlos@genesis.com', phone: '(11) 99999-0003', role: 'Vendedor' },
  ]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '' });

  // Agrupa por assigned_to
  const teamStats = useMemo(() => {
    return teamMembers.map(member => {
      const memberLeads = leads.filter(l => l.assigned_to === member.name);
      const closedLeads = memberLeads.filter(l => l.status === 'closed');
      const memberTasks = tasks.filter(t => t.assigned_to === member.name);
      const completedTasks = memberTasks.filter(t => t.status === 'completed');
      const totalValue = closedLeads.reduce((sum, l) => sum + (l.value || 0), 0);
      const conversionRate = memberLeads.length > 0 
        ? ((closedLeads.length / memberLeads.length) * 100).toFixed(0) 
        : '0';

      return {
        ...member,
        totalLeads: memberLeads.length,
        closedLeads: closedLeads.length,
        totalTasks: memberTasks.length,
        completedTasks: completedTasks.length,
        totalValue,
        conversionRate,
      };
    }).sort((a, b) => b.totalValue - a.totalValue);
  }, [leads, tasks, teamMembers]);

  const topPerformer = teamStats.find(m => m.totalValue > 0) || teamStats[0];

  const totalStats = useMemo(() => ({
    members: teamMembers.length,
    totalLeads: teamStats.reduce((sum, m) => sum + m.totalLeads, 0),
    closedLeads: teamStats.reduce((sum, m) => sum + m.closedLeads, 0),
    totalValue: teamStats.reduce((sum, m) => sum + m.totalValue, 0),
  }), [teamStats, teamMembers]);

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({ name: member.name, email: member.email, phone: member.phone, role: member.role });
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', phone: '', role: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (editingMember) {
      setTeamMembers(members => members.map(m => 
        m.id === editingMember.id ? { ...m, ...formData } : m
      ));
      toast.success('Membro atualizado!');
    } else {
      setTeamMembers(members => [...members, { id: Date.now().toString(), ...formData }]);
      toast.success('Membro adicionado!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTeamMembers(members => members.filter(m => m.id !== id));
    toast.success('Membro removido!');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Equipe</h1>
            <p className="text-muted-foreground text-sm">Gerencie sua equipe e acompanhe o desempenho</p>
          </div>
          <Button className="btn-primary gap-2" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Adicionar Membro
          </Button>
        </div>

        {/* Top Performer */}
        {topPerformer && (
          <div className="glass-card p-6 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/20">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Top Performer</p>
                <p className="text-2xl font-bold text-foreground">{topPerformer.name}</p>
                <p className="text-sm text-primary">
                  R$ {topPerformer.totalValue.toLocaleString('pt-BR')} em vendas • {topPerformer.conversionRate}% conversão
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-muted-foreground">{topPerformer.role}</p>
                <p className="text-sm text-muted-foreground">{topPerformer.closedLeads} vendas fechadas</p>
              </div>
            </div>
          </div>
        )}

        {/* Team Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Membros</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalStats.members}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-info/20">
                <Target className="w-5 h-5 text-info" />
              </div>
              <span className="text-sm text-muted-foreground">Leads Atribuídos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalStats.totalLeads}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Vendas Fechadas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalStats.closedLeads}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Receita Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              R$ {(totalStats.totalValue / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Membros da Equipe</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {teamStats.map((member, index) => (
              <div key={member.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0',
                      index === 0 && member.totalValue > 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button 
                      onClick={() => handleOpenModal(member)}
                      className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Performance Stats */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{member.totalLeads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-success">{member.closedLeads}</p>
                    <p className="text-xs text-muted-foreground">Vendas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{member.conversionRate}%</p>
                    <p className="text-xs text-muted-foreground">Conversão</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">R$ {(member.totalValue / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Receita</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Editar Membro' : 'Adicionar Membro'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Nome *</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome completo"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">E-mail *</label>
              <Input 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@empresa.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Telefone</label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(00) 00000-0000"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Cargo</label>
              <Input 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="Ex: Vendedor, Gerente..."
                className="input-field"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="flex-1 btn-primary" onClick={handleSave}>
                {editingMember ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}