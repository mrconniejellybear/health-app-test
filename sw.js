// sw.js - Background listener for GoodHealth

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 1. Listen for true incoming remote push payloads from a server
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {
    title: 'Medication Reminder',
    body: 'Time for your scheduled dose!',
    icon: 'healthappicon.pngg'
  };

  const options = {
    body: data.body,
    icon: data.icon || 'healthappicon.png',
    badge: 'healthappicon.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 2. Open the app when the user taps the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
