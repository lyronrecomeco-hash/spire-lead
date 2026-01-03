import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  className?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
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

export function Sidebar({ className, onCollapsedChange }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, tokenName } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Notify parent of collapsed state
  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">G</span>
            </div>
            <span className="font-semibold text-lg gradient-text">Genesis</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <span className="text-lg font-bold text-primary-foreground">G</span>
          </div>
        )}
        
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 lg:py-6 px-3 overflow-y-auto">
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

      {/* User & Controls */}
      <div className="p-3 lg:p-4 border-t border-sidebar-border space-y-2 lg:space-y-3">
        {!collapsed && tokenName && (
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <p className="text-xs text-muted-foreground">Logado como</p>
            <p className="text-sm font-medium text-foreground truncate">{tokenName}</p>
          </div>
        )}
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-sm">Sair</span>}
        </button>

        {/* Collapse button - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center gap-2 py-2 px-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-muted-foreground hover:text-foreground"
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
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-sidebar border border-sidebar-border text-foreground"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={cn(
          'hidden lg:flex fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex-col transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          className
        )}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
