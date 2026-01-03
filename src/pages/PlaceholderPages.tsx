import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';
import { Settings, User, Bell, Palette, Shield, Database, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const tabs = [
  { id: 'geral', label: 'Geral', icon: Settings },
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'aparencia', label: 'Aparência', icon: Palette },
  { id: 'seguranca', label: 'Segurança', icon: Shield },
  { id: 'dados', label: 'Dados', icon: Database },
];

export function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral');
  const [settings, setSettings] = useState({
    companyName: 'Genesis Projects',
    email: 'contato@genesis.com',
    phone: '(11) 99999-9999',
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false,
    darkMode: true,
    compactMode: false,
    twoFactorAuth: false,
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Configurações</h1>
            <p className="text-muted-foreground text-sm">Gerencie as configurações do sistema</p>
          </div>
          <Button className="btn-primary gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Salvar
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="glass-card p-2 lg:p-3">
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap',
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="glass-card p-6">
              {activeTab === 'geral' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Configurações Gerais</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Nome da Empresa</label>
                      <Input 
                        value={settings.companyName} 
                        onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">E-mail</label>
                      <Input 
                        type="email"
                        value={settings.email} 
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Telefone</label>
                      <Input 
                        value={settings.phone} 
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'perfil' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Perfil do Usuário</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-foreground">G</span>
                    </div>
                    <Button variant="outline">Alterar Foto</Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Nome Completo</label>
                      <Input defaultValue="Administrador" className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Cargo</label>
                      <Input defaultValue="Gerente de Vendas" className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notificacoes' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Notificações</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">Notificações por E-mail</p>
                        <p className="text-sm text-muted-foreground">Receba atualizações por e-mail</p>
                      </div>
                      <Switch 
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">Notificações Push</p>
                        <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                      </div>
                      <Switch 
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">Sons de Notificação</p>
                        <p className="text-sm text-muted-foreground">Tocar som ao receber notificação</p>
                      </div>
                      <Switch 
                        checked={settings.soundNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, soundNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'aparencia' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Aparência</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">Modo Escuro</p>
                        <p className="text-sm text-muted-foreground">Ativar tema escuro</p>
                      </div>
                      <Switch 
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">Modo Compacto</p>
                        <p className="text-sm text-muted-foreground">Reduzir espaçamento da interface</p>
                      </div>
                      <Switch 
                        checked={settings.compactMode}
                        onCheckedChange={(checked) => setSettings({...settings, compactMode: checked})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seguranca' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Segurança</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">Autenticação de Dois Fatores</p>
                        <p className="text-sm text-muted-foreground">Adicionar camada extra de segurança</p>
                      </div>
                      <Switch 
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                      />
                    </div>
                    <Button variant="outline" className="w-full">Alterar Senha</Button>
                    <Button variant="outline" className="w-full">Gerenciar Sessões Ativas</Button>
                  </div>
                </div>
              )}

              {activeTab === 'dados' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Dados</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Database className="w-5 h-5" />
                      Exportar Dados
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Database className="w-5 h-5" />
                      Importar Dados
                    </Button>
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                      <p className="font-medium text-destructive mb-2">Zona de Perigo</p>
                      <p className="text-sm text-muted-foreground mb-4">Ações irreversíveis</p>
                      <Button variant="destructive" size="sm">Limpar Todos os Dados</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}