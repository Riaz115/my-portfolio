"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, LogIn, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { RootState } from '@/store/store';
import { useGetWebsiteSettingsQuery } from '@/store/api/apiSlice';
import { logout } from '@/store/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import LogoutModal from '../ui/LogoutModal';

// Gradient SVG definition for icons
const GradientDefs = () => (
  <svg width="0" height="0">
    <defs>
      <linearGradient id="navbar-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#2563eb" offset="0%" />
        <stop stopColor="#38bdf8" offset="100%" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { data: settings } = useGetWebsiteSettingsQuery();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateHash = () => setActiveHash(window.location.hash);
      updateHash();
      window.addEventListener('hashchange', updateHash);
      return () => window.removeEventListener('hashchange', updateHash);
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await dispatch(logout());
    localStorage.removeItem('portfolio_auth');
    setLoading(false);
    setShowLogoutModal(false);
    toast.success('Logged out successfully');
    router.push('/auth/login');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#experience', label: 'Experience' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#contact', label: 'Contact' },
  ];

  // Helper to determine if a link is active
  const isLinkActive = (link: { href: string; label: string }) => {
    if (link.href === '/') return false; // Never active on '/'
    if (typeof window === 'undefined') return false;
    return window.location.hash === link.href;
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
      <GradientDefs />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
        .navbar-link {
          font-family: 'Poppins', 'Inter', sans-serif;
          font-weight: 700;
          background: linear-gradient(90deg, #2563eb, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          transition: color 0.2s;
        }
        .navbar-link::after {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 3px;
          background: linear-gradient(90deg, #2563eb, #38bdf8);
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .navbar-link:hover::after {
          width: 100%;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-heading font-bold text-xl text-gradient">
            Portfolio
            </span>
          </Link>

          {/* Centered Navigation */}
          <div className="flex-1 justify-center hidden lg:flex">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="navbar-link"
                  style={{ fontWeight: 700, fontFamily: 'Poppins, Inter, sans-serif' }}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="navbar-link flex items-center space-x-1" style={{ fontWeight: 700, fontFamily: 'Poppins, Inter, sans-serif' }}>
                      <Shield className="h-4 w-4" style={{ stroke: 'url(#navbar-gradient)' }} />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link href="/profile" className="navbar-link flex items-center space-x-1" style={{ fontWeight: 700, fontFamily: 'Poppins, Inter, sans-serif' }}>
                    <User className="h-4 w-4" style={{ stroke: 'url(#navbar-gradient)' }} />
                    <span>Profile</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowLogoutModal(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link
                href="/auth/login"
                className="navbar-link flex items-center space-x-1 px-2 py-2"
                style={{ fontWeight: 700, fontFamily: 'Poppins, Inter, sans-serif' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" style={{ stroke: 'url(#navbar-gradient)' }} />
                <span>Login</span>
              </Link>
              )}
            </div>
          </div>

          {/* Right side: Theme Toggle and Hamburger for mobile */}
          <div className="flex items-center ml-4">
            {/* Theme Toggle always visible on right */}
            <ThemeToggle />
            {/* Hamburger menu for mobile */}
            <button
              className="ml-2 flex lg:hidden p-2 rounded-md hover:bg-accent focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer/Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 h-screen flex lg:hidden">
            {/* Drawer Panel: left, no border radius, right border, bg color, shadow, animated */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-72 h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl"
            >
              {/* Portfolio and Close Icon Section */}
              <div className="flex items-center justify-between mb-6 px-6 pt-6 pb-2">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">P</span>
                  </div>
                  <span className="font-heading font-bold text-xl text-gradient">Portfolio</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6" />
                </button>
              </div>
              {/* Links Section */}
              <nav className="flex-1 flex flex-col gap-2 pl-4">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                  className="flex flex-col gap-2"
                >
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * idx }}
                    >
                  <Link
                    href={link.href}
                    className="navbar-link px-2 py-2 rounded hover:bg-accent"
                    style={{ fontWeight: 700, fontFamily: 'Poppins, Inter, sans-serif' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                    </motion.div>
                ))}
                <div className="border-t pt-3 mt-3">
                  {isAuthenticated ? (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * navLinks.length }}
                        className="space-y-2"
                      >
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="navbar-link flex items-center space-x-1 px-2 py-2"
                          style={{ fontWeight: 700, fontFamily: 'Poppins, Inter, sans-serif' }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4" style={{ stroke: 'url(#navbar-gradient)' }} />
                          <span>Admin</span>
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="navbar-link flex items-center space-x-1 px-2 py-2"
                        style={{ fontWeight: 700, fontFamily: 'Poppins, Inter, sans-serif' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" style={{ stroke: 'url(#navbar-gradient)' }} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center space-x-2 w-full text-left px-2 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                      </motion.div>
                  ) : (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * (navLinks.length + 1) }}
                      >
                    <Link
                      href="/auth/login"
                      className="navbar-link flex items-center space-x-1 px-2 py-2"
                      style={{ fontWeight: 700, fontFamily: 'Poppins, Inter, sans-serif' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" style={{ stroke: 'url(#navbar-gradient)' }} />
                      <span>Login</span>
                    </Link>
                      </motion.div>
                  )}
                </div>
                </motion.div>
              </nav>
            </motion.div>
            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}
      </div>
      <LogoutModal
        open={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        loading={loading}
      />
    </nav>
  );
}