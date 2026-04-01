import { auth, onAuthStateChanged, signOut } from "./firebase.js";

const joinLink = document.getElementById("joinLink");
const loginLink = document.getElementById("loginLink");
const logoutLink = document.getElementById("logoutLink");

onAuthStateChanged(auth, (user) => {
  if (!joinLink || !loginLink || !logoutLink) return;

  if (user) {
    joinLink.style.display = "none";
    loginLink.style.display = "none";
    logoutLink.style.display = "inline-block";
  } else {
    joinLink.style.display = "inline-block";
    loginLink.style.display = "inline-block";
    logoutLink.style.display = "inline-block";
    logoutLink.style.display = "none";
  }
});

if (logoutLink) {
  logoutLink.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}
