import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

const contentCache: RuntimeCaching = {
  urlPattern: ({ url }) => url.pathname.startsWith('/school') || url.pathname.startsWith('/docs'),
  handler: 'NetworkFirst',
  options: {
    cacheName: 'content-cache',
    networkTimeoutSeconds: 5,
    expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
    cacheableResponse: { statuses: [0, 200] },
  },
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [contentCache, ...defaultCache],
});

serwist.addEventListeners();
