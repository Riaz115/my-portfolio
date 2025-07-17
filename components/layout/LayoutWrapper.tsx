'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { Footer } from './Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && !isAuthPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminPage && !isAuthPage && <Footer />}
    </div>
  );
} 