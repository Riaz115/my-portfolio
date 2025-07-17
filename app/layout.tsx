import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getWebsiteSettings } from '@/lib/server-utils';
import SplashLayout from '@/components/layout/SplashLayout';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings();
  return {
    title: settings?.seo?.title || settings?.websiteName || 'Portfolio',
    description: settings?.seo?.description || '',
    icons: settings?.favicon ? { icon: settings.favicon } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SplashLayout>{children}</SplashLayout>
      </body>
    </html>
  );
}