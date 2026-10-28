// Renders scam cards from SCAM_TYPES (data.js) with category filter + search.

let activeCategory = "All";
let searchTerm = "";

function scamCardHtml(s) {
  const list = (items) => items.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
  return `
    <article class="card scam-card">
      <h3>${escapeHtml(s.title)}
        <span class="tag">${escapeHtml(s.category)}</span>
        ${s.isNew ? '<span class="tag tag-new">New tactic</span>' : ""}
      </h3>
      <p>${escapeHtml(s.summary)}</p>
      <details>
        <summary>How it works & what to do</summary>
        <p>${escapeHtml(s.howItWorks)}</p>
        <span class="label">Red flags</span>
        <ul class="flag-list">${list(s.redFlags)}</ul>
        <span class="label">What to do</span>
        <ul class="do-list">${list(s.whatToDo)}</ul>
      </details>
    </article>`;
}

function matches(s) {
  if (activeCategory !== "All" && s.category !== activeCategory) return false;
  if (!searchTerm) return true;
  const haystack = [s.title, s.summary, s.howItWorks, ...s.redFlags, ...s.whatToDo].join(" ").toLowerCase();
  return haystack.includes(searchTerm);
}

function renderScams() {
  const list = document.getElementById("scam-list");
  const results = SCAM_TYPES.filter(matches);
  list.innerHTML = results.length
    ? results.map(scamCardHtml).join("")
    : '<p class="empty">No scams match your search. Try another keyword.</p>';
}

function renderFilters() {
  const wrap = document.getElementById("scam-filters");
  wrap.innerHTML = SCAM_CATEGORIES.map(
    (c) => `<button class="chip" data-cat="${c}" aria-pressed="${c === activeCategory}">${c}</button>`
  ).join("");
  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    wrap.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", b === btn));
    renderScams();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  renderScams();
  document.getElementById("scam-search").addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    renderScams();
  });
});
