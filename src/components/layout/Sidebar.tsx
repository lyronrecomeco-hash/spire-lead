import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  UserPlus, 
  CheckSquare, 
  MessageCircle, 
  DollarSign, 
  BarChart3, 
  Zap, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Kanban, label: 'Kanban', path: '/kanban' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: UserPlus, label: 'Leads', path: '/leads' },
  { icon: CheckSquare, label: 'Tarefas', path: '/tarefas' },
  { icon: MessageCircle, label: 'WhatsApp', path: '/whatsapp' },
  { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
  { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
  { icon: Zap, label: 'Automações', path: '/automacoes' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">C</span>
            </div>
            <span className="font-semibold text-lg gradient-text">CRM Pro</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'sidebar-item relative',
                    isActive && 'active'
                  )}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Recolher</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
