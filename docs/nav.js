import {
  auth,
  onAuthStateChanged,
  signOut
} from './firebase.js';

const guestNav = document.getElementById('guestNav');
const accountNav = document.getElementById('accountNav');
const logoutNavBtn = document.getElementById('logoutNavBtn');

onAuthStateChanged(auth, (user) => {
  if (!guestNav || !accountNav) return;

  if (!user) {
    guestNav.style.display = 'flex';
    accountNav.style.display = 'none';
  } else {
    guestNav.style.display = 'none';
    accountNav.style.display = 'block';
  }
});

if (logoutNavBtn) {
  logoutNavBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = 'index.html';
  });
}
