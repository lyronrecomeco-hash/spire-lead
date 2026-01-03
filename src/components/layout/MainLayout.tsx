import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar onCollapsedChange={setSidebarCollapsed} />
      <main
        className={`flex-1 min-h-screen ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="p-4 pt-16 lg:pt-8 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}