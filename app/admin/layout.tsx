'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { PageLoader } from '@/components/ui/loader';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // For now, use a static heading. Later, this can be passed from each page.
  const heading = 'Dashboard';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <PageLoader />;
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar  />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1">
        {children}
        </div>
      </main>
    </div>
  );
}