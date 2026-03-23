import { auth, onAuthStateChanged, signOut } from './firebase.js';

function updateNavForUser(user) {
  const authArea = document.getElementById('navAuthArea');
  if (!authArea) return;

  if (user) {
    authArea.innerHTML = `
      <a href="vendor-dashboard.html">Dashboard</a>
      <a href="#" id="logoutLink" class="nav-cta">Log Out</a>
    `;

    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut(auth);
        window.location.href = 'index.html';
      });
    }
  } else {
    authArea.innerHTML = `
      <a href="signup.html" class="nav-cta">Join</a>
      <a href="login.html">Log In</a>
    `;
  }
}

onAuthStateChanged(auth, (user) => {
  updateNavForUser(user);
});
