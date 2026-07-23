import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { Providers } from './providers';
import { SidebarLeft } from '@/components/layout/SidebarLeft';
import { BottomActionBar } from '@/components/layout/BottomActionBar';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { ClientHeader, ClientFooter } from '@/components/layout/ClientOnly';
import { PreloaderCleanup } from '@/components/layout/PreloaderCleanup';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UCS service — Консультации и Обучения',
  description: 'Запись на консультации и обучение по программам rkeeper',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'UCS Service' },
};

export const viewport: Viewport = {
  themeColor: '#1a56db',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={manrope.className} suppressHydrationWarning>
        <div id="preloader">
          <div id="preloader-spinner" />
          <p id="preloader-text">Загрузка...</p>
        </div>
        <PreloaderCleanup />
        <div className="flex min-h-screen">
          <SidebarLeft />
          <div className="flex-1 flex flex-col min-w-0">
            <ClientHeader />
            <Providers>
              <main className="flex-1">
                <Breadcrumbs />
                {children}
              </main>
              <ClientFooter />
            </Providers>
          </div>
        </div>
        <BottomActionBar />
        <CookieBanner />
      </body>
    </html>
  );
}
