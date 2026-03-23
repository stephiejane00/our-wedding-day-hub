import { auth, onAuthStateChanged, signOut } from './firebase.js';

onAuthStateChanged(auth, (user) => {
  const navAuthArea = document.getElementById('navAuthArea');
  if (!navAuthArea) return;

  if (user) {
    navAuthArea.innerHTML = `
      <a href="vendor-dashboard.html">Dashboard</a>
      <a href="#" id="logoutBtn" class="nav-cta">Log Out</a>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await signOut(auth);
      window.location.href = 'index.html';
    });

  } else {
    navAuthArea.innerHTML = `
      <a href="signup.html" class="nav-cta">Join</a>
      <a href="login.html">Log In</a>
    `;
  }
});
