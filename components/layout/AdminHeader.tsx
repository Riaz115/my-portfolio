
'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { useDispatch, useSelector } from 'react-redux';

interface AdminHeaderProps {
  heading: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ heading }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: any) => state.ui.isSidebarOpen);

  const handleMenuClick = () => {
    dispatch(toggleSidebar(!isSidebarOpen));
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 lg:py-6 border-b border-muted bg-background sticky top-0 z-30">
      <div className="flex-1 flex justify-start">
        <h1 className="text-base lg:text-xl text-capitalize font-semibold whitespace-nowrap">{heading}</h1>
      </div>
      <button
        className="lg:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Open sidebar"
        onClick={handleMenuClick}
      >
        <Menu size={28} />
      </button>
    </header>
  );
};