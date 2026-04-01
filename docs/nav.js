import { auth, onAuthStateChanged, signOut } from "./firebase.js";

const loginLink = document.getElementById("loginLink");
const dashboardLink = document.getElementById("dashboardLink");
const logoutLink = document.getElementById("logoutLink");

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

if (logoutLink) {
  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}
