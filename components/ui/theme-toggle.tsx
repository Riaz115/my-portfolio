'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Gradient SVG definition for icon
  const GradientDefs = () => (
    <svg width="0" height="0">
      <defs>
        <linearGradient id="theme-toggle-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#2563eb" offset="0%" />
          <stop stopColor="#38bdf8" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (!mounted) {
    return <Button variant="ghost" size="icon"><Sun className="h-5 w-5" /></Button>;
  }

  return (
    <>
      <GradientDefs />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" style={{ stroke: 'url(#theme-toggle-gradient)' }} />
        ) : (
          <Sun className="h-5 w-5" style={{ stroke: 'url(#theme-toggle-gradient)' }} />
        )}
      </Button>
    </>
  );
}