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

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}
