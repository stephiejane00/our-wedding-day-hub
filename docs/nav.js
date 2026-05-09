import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot
} from './firebase.js';

import {
  getMessaging,
  getToken,
  onMessage
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging.js';

import { app } from './firebase.js';

// ── VAPID key for FCM (from Firebase Console → Project Settings → Cloud Messaging)
// Replace this with your actual VAPID key
const VAPID_KEY = 'YOUR_VAPID_KEY_HERE';

// ── Nav elements (present on every page)
const joinLink      = document.getElementById('joinLink');
const loginLink     = document.getElementById('loginLink');
const logoutLink    = document.getElementById('logoutLink');
const dashboardLink = document.getElementById('dashboardLink');
const messagesLink  = document.getElementById('messagesLink');
const msgNavBadge   = document.getElementById('msgNavBadge');

// ── Unsubscribe handle for Firestore listener
let unsubUnread = null;

function getDashboardUrl(role) {
  if (role === 'couple') return 'couple-dashboard.html';
  if (role === 'vendor') return 'dashboard.html';
  return null;
}

function setLoggedOutNav() {
  if (joinLink)      joinLink.style.display      = 'inline-flex';
  if (loginLink)     loginLink.style.display     = 'inline-flex';
  if (logoutLink)    logoutLink.style.display    = 'none';
  if (dashboardLink) dashboardLink.style.display = 'none';
  if (messagesLink)  messagesLink.style.display  = 'none';
  if (unsubUnread) { unsubUnread(); unsubUnread = null; }
}

function setLoggedInNav(dashboardUrl) {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (joinLink)  joinLink.style.display  = 'none';
  if (loginLink) loginLink.style.display = 'none';
  if (logoutLink) logoutLink.style.display = 'inline-flex';

  if (dashboardLink && dashboardUrl) {
    dashboardLink.href = dashboardUrl;
    const onDash = currentPage === 'dashboard.html' || currentPage === 'couple-dashboard.html';
    dashboardLink.style.display = onDash ? 'none' : 'inline-flex';
  } else if (dashboardLink) {
    dashboardLink.style.display = 'none';
  }
}

async function getUserRole(user) {
  try {
    const userSnap = await getDoc(doc(db, 'users', user.uid));
    if (userSnap.exists()) return userSnap.data().role || null;
    return null;
  } catch (err) {
    console.error('Error getting user role:', err);
    return null;
  }
}

// ── Live unread badge for vendors only
function startUnreadListener(uid) {
  if (unsubUnread) { unsubUnread(); unsubUnread = null; }
  if (!messagesLink || !msgNavBadge) return;

  messagesLink.style.display = 'inline-flex';

  unsubUnread = onSnapshot(
    query(collection(db, 'conversations'), where('vendorId', '==', uid)),
    (snap) => {
      let total = 0;
      snap.forEach(d => { total += (d.data().vendorUnread || 0); });
      if (total > 0) {
        msgNavBadge.textContent = total > 99 ? '99+' : total;
        msgNavBadge.style.display = 'inline-flex';
      } else {
        msgNavBadge.style.display = 'none';
      }
    }
  );
}

// ── FCM push notifications
async function setupPushNotifications(uid) {
  try {
    // Register the service worker
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const messaging = getMessaging(app);

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Push notification permission denied.');
      return;
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg
    });

    if (token) {
      // Save token to Firestore so you can send targeted notifications
      await setDoc(doc(db, 'vendors', uid), { fcmToken: token, fcmUpdatedAt: new Date().toISOString() }, { merge: true });
      console.log('FCM token saved.');
    }

    // Handle foreground messages (site is open)
    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || 'New message';
      const body  = payload.notification?.body  || 'You have a new message.';
      const icon  = payload.notification?.icon  || '/images/logo.png';

      // Show a native notification even when the tab is open
      if (Notification.permission === 'granted') {
        const notif = new Notification(title, { body, icon });
        notif.onclick = () => {
          window.focus();
          window.location.href = 'messages.html';
        };
      }
    });

  } catch (err) {
    // Push setup is non-critical — log quietly and move on
    console.warn('Push notification setup skipped:', err.message);
  }
}

// ── Auth state
onAuthStateChanged(auth, async (user) => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (!user) {
    setLoggedOutNav();
    return;
  }

  const role = await getUserRole(user);
  const dashboardUrl = getDashboardUrl(role);
  setLoggedInNav(dashboardUrl);

  // Messages link + badge only for vendors
  if (role === 'vendor') {
    startUnreadListener(user.uid);
    // Only ask for push permission once — don't nag on every page load
    if ('Notification' in window && 'serviceWorker' in navigator) {
      if (Notification.permission === 'default') {
        // Slight delay so it doesn't fire immediately on page load
        setTimeout(() => setupPushNotifications(user.uid), 3000);
      } else if (Notification.permission === 'granted') {
        setupPushNotifications(user.uid);
      }
    }
  } else {
    if (messagesLink) messagesLink.style.display = 'none';
  }

  // Only auto-redirect from LOGIN page
  if (currentPage === 'login.html' && dashboardUrl) {
    window.location.href = dashboardUrl;
  }
});

// ── Logout
if (logoutLink) {
  logoutLink.addEventListener('click', async () => {
    try {
      if (unsubUnread) { unsubUnread(); unsubUnread = null; }
      await signOut(auth);
      window.location.href = 'index.html';
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed. Please try again.');
    }
  });
}

// ── Login / join redirect if already logged in
if (loginLink) {
  loginLink.addEventListener('click', async (e) => {
    if (auth.currentUser) {
      e.preventDefault();
      const role = await getUserRole(auth.currentUser);
      const url = getDashboardUrl(role);
      if (url) window.location.href = url;
    }
  });
}

if (joinLink) {
  joinLink.addEventListener('click', async (e) => {
    if (auth.currentUser) {
      e.preventDefault();
      const role = await getUserRole(auth.currentUser);
      const url = getDashboardUrl(role);
      if (url) window.location.href = url;
    }
  });
}
