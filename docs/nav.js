// ── SHARED SITE NAV ──
// This injects the same topbar into every page.

function buildSiteNav() {
  const navMount = document.getElementById("siteNav");
  if (!navMount) return;

  navMount.innerHTML = `
    <header class="site-topbar">
      <a href="index.html" class="site-topbar-logo-wrap" aria-label="Go to homepage">
        <img src="images/logo1.png" alt="Our Wedding Day Hub" class="site-topbar-logo">
      </a>

      <div class="site-topbar-title">
        <h1>Our Wedding Day Hub</h1>
      </div>

      <nav class="site-topbar-actions">
        <div class="nav-links">
          <a href="categories.html" class="site-topbar-link">Categories</a>
          <a href="shop.html" class="site-topbar-link">Boutique</a>
          <a href="journal.html" class="site-topbar-link">The Journal</a>

          <a href="messages.html" id="messagesLink" class="site-topbar-link" style="display:none; position:relative;">
            Messages
            <span id="msgNavBadge" style="display:none; position:absolute; top:-6px; right:-10px; background:var(--ink); color:var(--cream); font-size:0.64rem; font-weight:700; padding:2px 6px; border-radius:999px; line-height:1.2; min-width:18px; text-align:center;">0</span>
          </a>

          <a href="dashboard.html" id="dashboardLink" class="site-topbar-link" style="display:none;">Dashboard</a>
          <button id="logoutLink" class="site-topbar-btn" style="display:none;">Log Out</button>
        </div>

        <a href="login.html" id="loginLink" class="site-topbar-link">Log In</a>
        <a href="signup.html" id="joinLink" class="site-topbar-btn">Join</a>
        <button class="mobile-menu-btn" type="button" aria-label="Open menu">☰</button>
      </nav>
    </header>
  `;

  const menuButton = navMount.querySelector(".mobile-menu-btn");
  const navLinks = navMount.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
}

buildSiteNav();
