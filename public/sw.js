// FudyGo Service Worker
// Workbox handles caching via vite-plugin-pwa.
// This file is a stub — push notification logic goes here when needed.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

// --- Push Notifications (future) ---
// self.addEventListener('push', (event) => {
//   const data = event.data?.json() ?? {}
//   event.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.body,
//       icon: '/pwa-192x192.svg',
//     })
//   )
// })
