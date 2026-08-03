import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { Providers } from './providers';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { ClientHeader, ClientFooter } from '@/components/layout/ClientOnly';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UCS service — Консультации и Обучения',
  description: 'Обучение и документация по программам rkeeper',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'UCS Service' },
};

export const viewport: Viewport = {
  themeColor: '#1a56db',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="ru" className={manrope.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={manrope.className}>
        <div className="flex min-h-screen">
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
        <CookieBanner />
      </body>
    </html>
  );
}