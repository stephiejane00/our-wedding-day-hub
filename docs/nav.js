import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc
} from './firebase.js';

const joinLink = document.getElementById('joinLink');
const loginLink = document.getElementById('loginLink');
const logoutLink = document.getElementById('logoutLink');
const dashboardLink = document.getElementById('dashboardLink');

function getDashboardUrl(role) {
  if (role === 'couple') {
    return 'couple-dashboard.html';
  }

  if (role === 'vendor') {
    return 'dashboard.html';
  }

  return null;
}

function setLoggedOutNav() {
  if (joinLink) joinLink.style.display = 'inline-flex';
  if (loginLink) loginLink.style.display = 'inline-flex';
  if (logoutLink) logoutLink.style.display = 'none';

  if (dashboardLink) {
    dashboardLink.style.display = 'none';
  }
}

function setLoggedInNav(dashboardUrl) {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (joinLink) joinLink.style.display = 'none';
  if (loginLink) loginLink.style.display = 'none';
  if (logoutLink) logoutLink.style.display = 'inline-flex';

  if (dashboardLink && dashboardUrl) {
    dashboardLink.href = dashboardUrl;

    if (
      currentPage === 'dashboard.html' ||
      currentPage === 'couple-dashboard.html'
    ) {
      dashboardLink.style.display = 'none';
    } else {
      dashboardLink.style.display = 'inline-flex';
    }
  } else if (dashboardLink) {
    dashboardLink.style.display = 'none';
  }
}

async function getUserRole(user) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.role || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

onAuthStateChanged(auth, async (user) => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (!user) {
    setLoggedOutNav();
    return;
  }

  const role = await getUserRole(user);
  const dashboardUrl = getDashboardUrl(role);

  setLoggedInNav(dashboardUrl);

  // Only auto-redirect from LOGIN page, not SIGNUP page
  if (currentPage === 'login.html' && dashboardUrl) {
    window.location.href = dashboardUrl;
  }
});

if (logoutLink) {
  logoutLink.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  });
}

if (loginLink) {
  loginLink.addEventListener('click', async (e) => {
    if (auth.currentUser) {
      e.preventDefault();
      const role = await getUserRole(auth.currentUser);
      const dashboardUrl = getDashboardUrl(role);

      if (dashboardUrl) {
        window.location.href = dashboardUrl;
      }
    }
  });
}

if (joinLink) {
  joinLink.addEventListener('click', async (e) => {
    if (auth.currentUser) {
      e.preventDefault();
      const role = await getUserRole(auth.currentUser);
      const dashboardUrl = getDashboardUrl(role);

      if (dashboardUrl) {
        window.location.href = dashboardUrl;
      }
    }
  });
}
