import { auth, onAuthStateChanged, signOut } from './firebase.js';

onAuthStateChanged(auth, (user) => {
  const navAuthArea = document.getElementById('navAuthArea');
  if (!navAuthArea) return;

  if (user) {import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* YOUR FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* NAV ELEMENTS */
const loginLink = document.getElementById("loginLink");
const dashboardLink = document.getElementById("dashboardLink");
const logoutLink = document.getElementById("logoutLink");

/* AUTH STATE */
onAuthStateChanged(auth, (user) => {
  if (!loginLink || !dashboardLink || !logoutLink) return;

  if (user) {
    loginLink.style.display = "none";
    dashboardLink.style.display = "inline-block";
    logoutLink.style.display = "inline-block";
  } else {
    loginLink.style.display = "inline-block";
    dashboardLink.style.display = "none";
    logoutLink.style.display = "none";
  }
});

/* LOGOUT */
if (logoutLink) {
  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "index.html";
  });
}
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
