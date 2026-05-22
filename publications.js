const ORCID_WORK_TYPES = new Set([
  "journal-article",
  "conference-paper",
  "working-paper",
]);

function escapeHtml(text) {
  const el = document.createElement("span");
  el.textContent = text;
  return el.innerHTML;
}

function formatAuthors(contributors) {
  const names = contributors
    .map((c) => c?.["credit-name"]?.value)
    .filter(Boolean);

  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]}, ${names[1]}`;
  return `${names[0]}, ${names[1]}, et al.`;
}

function formatVenue(work) {
  const journal = work["journal-title"]?.value || "";
  const year = work["publication-date"]?.year?.value || "";
  const parts = [];
  if (journal) parts.push(journal);
  if (year) parts.push(`(${year})`);
  return parts.join(" ");
}

function parseWork(summary) {
  const contributors = summary.contributors?.contributor || [];
  let doi = "";
  for (const ext of summary["external-ids"]?.["external-id"] || []) {
    if (ext["external-id-type"] === "doi") {
      doi = ext["external-id-value"] || "";
    }
  }

  return {
    title: summary.title?.title?.value || "Untitled",
    type: summary.type || "other",
    year: Number(summary["publication-date"]?.year?.value) || 0,
    venue: formatVenue(summary),
    doi,
    authors: formatAuthors(contributors),
  };
}

function renderPublication(pub, index) {
  const doiLink = pub.doi
    ? `<a class="pub-link" href="https://doi.org/${escapeHtml(pub.doi)}" target="_blank" rel="noopener noreferrer">doi:${escapeHtml(pub.doi)}</a>`
    : "";

  const venueHtml = pub.venue
    ? `<span class="pub-venue"><em>${escapeHtml(pub.venue)}</em></span>`
    : "";

  const authorsHtml = pub.authors
    ? `<cite>${escapeHtml(pub.authors)}</cite>`
    : "";

  return `
    <li>
      ${authorsHtml}
      <span class="pub-title">“${escapeHtml(pub.title)}”</span>
      ${venueHtml}
      ${doiLink}
    </li>
  `;
}

async function loadOrcidPublications() {
  const list = document.getElementById("publication-list");
  const status = document.getElementById("publications-status");
  if (!list) return;

  const orcid = window.SITE_CONFIG?.orcid || "0000-0001-6966-5316";
  const url = `https://pub.orcid.org/v3.0/${orcid}/works`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`ORCID API returned ${response.status}`);
    }

    const data = await response.json();
    const works = (data.group || [])
      .map((group) => parseWork(group["work-summary"][0]))
      .filter((work) => ORCID_WORK_TYPES.has(work.type))
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

    list.classList.remove("publication-list--loading");

    if (works.length === 0) {
      list.innerHTML = `<li class="pub-empty">No publications found on ORCID.</li>`;
    } else {
      list.innerHTML = works.map((work, i) => renderPublication(work, i)).join("");
    }

    if (status) {
      status.innerHTML = `Showing ${works.length} works from <a href="https://orcid.org/${orcid}" target="_blank" rel="noopener noreferrer">ORCID</a> (journal articles, conference papers, and preprints).`;
    }
  } catch (err) {
    console.error(err);
    list.classList.remove("publication-list--loading");
    list.innerHTML = `<li class="pub-empty">Could not load publications from ORCID. Please try again later.</li>`;
    if (status) {
      status.textContent = "Publication list unavailable.";
    }
  }
}

loadOrcidPublications();
