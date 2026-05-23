document.getElementById("year").textContent = new Date().getFullYear();

function setupProfileLink(id, anchorId, url) {
  const item = document.getElementById(id);
  const anchor = document.getElementById(anchorId);
  if (!item || !anchor || !url) return;
  anchor.href = url;
  item.hidden = false;
}

const config = window.SITE_CONFIG || {};
setupProfileLink("link-google-scholar", "anchor-google-scholar", config.googleScholar);
setupProfileLink("link-researchgate", "anchor-researchgate", config.researchGate);

const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");

function setNavOpen(open) {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
}

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    setNavOpen(!menu.classList.contains("is-open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setNavOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 769px)").matches) {
      setNavOpen(false);
    }
  });
}
