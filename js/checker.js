// Red-flag cards + the "Is this a scam?" self-check (weights come from CHECKER_ITEMS in data.js).

const RISK_LEVELS = [
  { min: 0, label: "Tick some boxes", color: "var(--border)", text: "", advice: "Your result will appear here." },
  { min: 1, label: "Low risk", color: "var(--green)", text: "var(--green-text)", advice: "Probably fine, but stay alert. Don't click links you weren't expecting." },
  { min: 4, label: "Medium risk", color: "var(--amber)", text: "var(--amber-text)", advice: "This has signs of a scam. Don't reply or click anything. Verify through the official app, website or hotline." },
  { min: 7, label: "High risk: likely a scam", color: "var(--red)", text: "var(--red-text)", advice: "Stop all contact now. Don't send money or codes. If you've already shared details, call your bank immediately and report it." },
];

function renderFlags() {
  document.getElementById("flag-grid").innerHTML = RED_FLAGS.map(
    (f) => `
      <article class="card">
        <h3>${escapeHtml(f.title)}</h3>
        <p>${escapeHtml(f.text)}</p>
      </article>`
  ).join("");
}

function renderChecker() {
  document.getElementById("checker-form").innerHTML = CHECKER_ITEMS.map(
    (item, i) => `
      <label class="check-item">
        <input type="checkbox" name="flag" value="${i}" />
        <span>${escapeHtml(item.text)}</span>
      </label>`
  ).join("");
}

function updateRisk() {
  const checked = document.querySelectorAll('#checker-form input:checked');
  const score = Array.from(checked).reduce((sum, el) => sum + CHECKER_ITEMS[el.value].weight, 0);
  const level = [...RISK_LEVELS].reverse().find((l) => score >= l.min);

  const fill = document.getElementById("meter-fill");
  fill.style.width = `${Math.min(100, (score / 10) * 100)}%`;
  fill.style.background = level.color;
  document.getElementById("risk-label").textContent = level.label;
  document.getElementById("risk-label").style.color = level.text;
  document.getElementById("risk-advice").textContent = level.advice;
}

document.addEventListener("DOMContentLoaded", () => {
  renderFlags();
  renderChecker();
  const form = document.getElementById("checker-form");
  form.addEventListener("change", updateRisk);
  document.getElementById("reset-checker").addEventListener("click", () => {
    form.reset();
    updateRisk();
  });
});
