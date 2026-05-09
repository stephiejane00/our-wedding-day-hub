// firebase-messaging-sw.js
// Place this file in your ROOT folder (same level as index.html)

importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyDQ2gwuJoe2si8xYfhB6n9mESfSon4zRq8",
  authDomain:        "ourweddingdayhub.firebaseapp.com",
  projectId:         "ourweddingdayhub",
  storageBucket:     "ourweddingdayhub.firebasestorage.app",
  messagingSenderId: "221957124766",
  appId:             "1:221957124766:web:83b7ba2351c1ad656e018f"
});

const messaging = firebase.messaging();

// Handle background messages (site is closed or tab is not focused)
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'New message on Our Wedding Day Hub';
  const body  = payload.notification?.body  || 'You have a new message or enquiry.';
  const icon  = payload.notification?.icon  || '/images/logo.png';
  const badge = '/images/logo.png';

  self.registration.showNotification(title, {
    body,
    icon,
    badge,
    data: { url: '/messages.html' },
    vibrate: [200, 100, 200]
  });
});

// When vendor clicks the notification, open the messages page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/messages.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If site is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          return client.navigate(targetUrl);
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
