import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 ml-64 min-h-screen"
      >
        <div className="p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
