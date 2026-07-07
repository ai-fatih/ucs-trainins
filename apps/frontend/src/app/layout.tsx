import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'UCS service — Консультации и Обучения',
  description: 'Запись на консультации и обучение по программам rkeeper',
  manifest: '/manifest.json',
  themeColor: '#1a56db',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'UCS Service' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Header />
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
