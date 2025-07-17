
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  User,
  Award,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
  X as CloseIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LogoutModal from '../ui/LogoutModal';

const sidebarItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/home', icon: User, label: 'Home Data' },
  { href: '/admin/about', icon: User, label: 'About' },
  { href: '/admin/skills', icon: Award, label: 'Skills' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/admin/contacts', icon: MessageSquare, label: 'Contacts' },
  { href: '/admin/settings', icon: Settings, label: 'Website Settings' },
];

const hideScrollbar = `
  .sidebar-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .sidebar-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const isSidebarOpen = useSelector((state: any) => state.ui.isSidebarOpen);

  const handleClose = () => {
    dispatch(toggleSidebar(false));
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    setLoading(true);
    await dispatch(logout());
    setLoading(false);
    setShowLogoutModal(false);
    router.push('/');
    handleClose();
  };

  const sidebarContent = (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'h-full bg-card border-r flex flex-col transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <style>{hideScrollbar}</style>
  
      <div className="flex flex-col p-0">
  <div className="flex items-center justify-between px-6 pt-6 pb-2 group">
  
    <Link
      href="/"
      className={cn(
        'font-bold tracking-wide text-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent cursor-pointer',
        isCollapsed && 'text-xl'
      )}
      style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
    >
      {!isCollapsed && 'Admin Panel'}
    </Link>

    <div className="flex items-center">
   
      <button
        className="hidden lg:inline-flex p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={e => { e.preventDefault(); setIsCollapsed(prev => !prev); }}
      >
        {isCollapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
      </button>

   
      <button
        className="lg:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Close sidebar"
        onClick={handleClose}
      >
        <CloseIcon size={28} />
      </button>
    </div>
  </div>

  <div className="border-b border-muted w-full mx-auto" />
</div>

      <nav className={cn('flex-1 sidebar-scrollbar overflow-y-auto space-y-4 transition-all duration-300', isCollapsed ? 'px-2' : 'px-6')}
        style={{ minHeight: 0 }}
      >
        <AnimatePresence>
          {sidebarItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5, delay: 0.07 * idx }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-xl transition-all duration-300 transform text-lg font-semibold',
                    isActive
                      ? 'bg-primary text-primary-foreground scale-105 shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    isCollapsed ? 'justify-center px-0 py-4' : 'space-x-5 px-4 py-4',
                  )}
                  onClick={handleClose}
                >
                  <Icon className="h-6 w-6" />
                  <span
                    className={cn(
                      'transition-all duration-300',
                      isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100 ml-4',
                      'text-base'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </nav>
      <div className={cn('border-t transition-all duration-300', isCollapsed ? 'p-2' : 'p-6')}
      >
        <Button
          variant="ghost"
          className={cn(
            'w-full flex items-center text-lg font-semibold transition-all duration-300',
            isCollapsed ? 'justify-center px-0 py-4 space-x-0' : 'space-x-5 px-4 py-4',
            'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut className="h-7 w-7" />
          <span
            className={cn(
              'transition-all duration-300',
              isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100 ml-4',
              'text-base'
            )}
          >
            Logout
          </span>
        </Button>
      </div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn('fixed inset-0 z-40 lg:hidden transition-all')}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn('absolute left-0 top-0 h-full w-64 bg-card border-r shadow-lg')}
            >
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <aside
        className={cn(
          'hidden lg:flex h-screen sticky top-0 z-30 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64',
          !isSidebarOpen && 'hidden'
        )}
      >
        {sidebarContent}
      </aside>
      <LogoutModal
        open={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        loading={loading}
      />
    </>
  );
}