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
    return 'https://ourweddingdayhub.com/couple-dashboard.html';
  }
  return 'https://ourweddingdayhub.com/dashboard.html';
}

function setLoggedOutNav() {
  if (joinLink) joinLink.style.display = 'inline-flex';
  if (loginLink) loginLink.style.display = 'inline-flex';
  if (logoutLink) logoutLink.style.display = 'none';

  if (dashboardLink) {
    dashboardLink.style.display = 'none';
    dashboardLink.href = 'https://ourweddingdayhub.com/dashboard.html';
  }
}

function setLoggedInNav(dashboardUrl) {
  if (joinLink) joinLink.style.display = 'none';
  if (loginLink) loginLink.style.display = 'none';
  if (logoutLink) logoutLink.style.display = 'inline-flex';

  if (dashboardLink) {
    dashboardLink.style.display = 'inline-flex';
    dashboardLink.href = dashboardUrl;
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
    console.error('Could not get user role:', error);
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

  const authPages = ['login.html', 'signup.html'];

  if (authPages.includes(currentPage)) {
    window.location.href = dashboardUrl;
  }
});

if (logoutLink) {
  logoutLink.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = 'https://ourweddingdayhub.com/index.html';
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  });
}

if (joinLink) {
  joinLink.addEventListener('click', async (e) => {
    if (auth.currentUser) {
      e.preventDefault();
      const role = await getUserRole(auth.currentUser);
      window.location.href = getDashboardUrl(role);
    }
  });
}

if (loginLink) {
  loginLink.addEventListener('click', async (e) => {
    if (auth.currentUser) {
      e.preventDefault();
      const role = await getUserRole(auth.currentUser);
      window.location.href = getDashboardUrl(role);
    }
  });
}
