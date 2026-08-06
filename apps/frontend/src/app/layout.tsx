import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Manrope } from 'next/font/google';
import { Providers } from './providers';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { Hotkeys } from '@/components/layout/Hotkeys';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { SchoolProgressBridge } from '@/components/school/SchoolProgressBridge';
import { BreadcrumbsJsonLdScript } from '@/components/layout/BreadcrumbsJsonLdScript';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

const SITE_URL = 'https://ucs-service.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'UCS Service — Обучение и документация по rkeeper',
    template: '%s — UCS Service',
  },
  description:
    'Открытый портал: инструкции, тренажёры и курсы по rkeeper. Обучение и документация без регистрации.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'UCS Service' },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'UCS Service',
    title: 'UCS Service — Обучение и документация по rkeeper',
    description:
      'Открытый портал: инструкции, тренажёры и курсы по rkeeper. Обучение и документация без регистрации.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UCS Service — Обучение и документация по rkeeper',
    description:
      'Открытый портал: инструкции, тренажёры и курсы по rkeeper. Обучение и документация без регистрации.',
    images: ['/images/og-default.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#1a56db',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="ru" className={manrope.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var s=localStorage.getItem('ucs_theme');var t=s==='dark'||s==='light'?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`}
        </Script>
      </head>
      <body className={manrope.className}>
        <BreadcrumbsJsonLdScript />
        <div className="flex min-h-screen">
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <Providers>
              <main className="flex-1">
                <Breadcrumbs />
                {children}
              </main>
              <Footer />
            </Providers>
          </div>
        </div>
        <Hotkeys />
        <SearchDialog />
        <CookieBanner />
        <SchoolProgressBridge />
      </body>
    </html>
  );
}