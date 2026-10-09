/**
 * Service Worker for NASAFISHA PWA (FR-023 / NFR-002)
 * Caches app shell, design tokens, and core assets with network-first / cache-fallback strategy.
 */

const CACHE_NAME = 'nasafisha-shell-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/tokens.css',
  '/manifest.webmanifest',
  '/offline.html',
];

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
  }
}

// Standalone service worker lifecycle logic for building sw.js if needed
export const swConfig = {
  cacheName: CACHE_NAME,
  precacheAssets: PRECACHE_ASSETS,
};

export default registerServiceWorker;
