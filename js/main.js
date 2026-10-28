// Shared behaviour for every page: header, footer, nav, dark mode, reveal-on-scroll.

const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "scams.html", label: "Scam Types" },
  { href: "warning-signs.html", label: "Warning Signs" },
  { href: "what-to-do.html", label: "What To Do" },
  { href: "quiz.html", label: "Quiz" },
];

function currentPage() {
  const file = location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const links = NAV_LINKS.map(
    (l) =>
      `<li><a href="${l.href}" class="${l.href === currentPage() ? "active" : ""}">${l.label}</a></li>`
  ).join("");

  header.innerHTML = `
    <div class="header-bars" aria-hidden="true"><span></span><span></span><span></span></div>
    <nav class="container nav" aria-label="Main">
      <a class="logo" href="index.html">It's Not If, <span>It's When.</span></a>
      <ul class="nav-links" id="nav-links">${links}</ul>
      <div class="nav-actions">
        <button class="icon-btn" id="theme-btn" aria-label="Toggle dark mode"></button>
        <button class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">☰</button>
      </div>
    </nav>`;

  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <h3>It's Not If, It's When.</h3>
          <p>A community scam awareness project. Anyone can be a target, so stay informed and look out for each other.</p>
        </div>
        <div>
          <h3>Need help now?</h3>
          <ul>
            <li>ScamShield Helpline: <a href="tel:1799">1799</a></li>
            <li>Police Hotline: <a href="tel:18002550000">1800-255-0000</a></li>
            <li>Emergency: <a href="tel:999">999</a></li>
            <li><a href="https://www.police.gov.sg/i-witness" target="_blank" rel="noopener">Report online (i-Witness)</a></li>
          </ul>
        </div>
        <div>
          <h3>Learn more</h3>
          <ul>
            <li><a href="https://www.scamshield.gov.sg" target="_blank" rel="noopener">ScamShield</a></li>
            <li><a href="https://www.scamalert.sg" target="_blank" rel="noopener">ScamAlert.sg</a></li>
            <li><a href="quiz.html">Take the quiz</a></li>
          </ul>
        </div>
      </div>
      <p class="fine">Student project for educational purposes. Always confirm with official sources.</p>
    </div>`;
}

function renderSosButton() {
  if (currentPage() === "what-to-do.html") return;
  const a = document.createElement("a");
  a.className = "sos";
  a.href = "what-to-do.html";
  a.textContent = "Got scammed? Act now";
  document.body.appendChild(a);
}

const SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const MOON_ICON = `<svg ${SVG_ATTRS}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
const SUN_ICON = `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;

function setupTheme() {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  const btn = document.getElementById("theme-btn");
  if (!btn) return;
  const sync = () => (btn.innerHTML = root.getAttribute("data-theme") === "dark" ? SUN_ICON : MOON_ICON);
  sync();
  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

// Escape user-facing strings before putting them into innerHTML.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderSosButton();
  setupTheme();
  setupReveal();
});
