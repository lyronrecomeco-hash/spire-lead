import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar onCollapsedChange={setSidebarCollapsed} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="p-4 pt-16 lg:pt-8 lg:p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
