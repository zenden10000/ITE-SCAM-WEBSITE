// Spot-the-scam quiz driven by QUIZ_QUESTIONS (data.js).

let index = 0;
let score = 0;
let answered = false;

const quizEl = () => document.getElementById("quiz");

function renderQuestion() {
  const q = QUIZ_QUESTIONS[index];
  answered = false;
  quizEl().innerHTML = `
    <p><strong>Question ${index + 1} of ${QUIZ_QUESTIONS.length}</strong> · Score: ${score}</p>
    <div class="progress"><div class="progress-fill" style="width:${(index / QUIZ_QUESTIONS.length) * 100}%"></div></div>
    <div class="phone">
      <div class="msg-from">From: ${escapeHtml(q.from)}</div>
      <div class="bubble">
        <span class="msg-channel">${escapeHtml(q.channel)}</span><br />${escapeHtml(q.message)}
      </div>
    </div>
    <div class="answers">
      <button class="btn btn-danger" data-answer="scam">Scam</button>
      <button class="btn btn-primary" data-answer="legit">Legit</button>
    </div>
    <div class="feedback" id="feedback"></div>`;

  quizEl().querySelectorAll("[data-answer]").forEach((btn) =>
    btn.addEventListener("click", () => answer(btn.dataset.answer === "scam"))
  );
}

function answer(saidScam) {
  if (answered) return;
  answered = true;
  const q = QUIZ_QUESTIONS[index];
  const correct = saidScam === q.isScam;
  if (correct) score++;

  quizEl().querySelectorAll("[data-answer]").forEach((b) => (b.disabled = true));
  const fb = document.getElementById("feedback");
  fb.className = `feedback show ${correct ? "correct" : "wrong"}`;
  fb.innerHTML = `
    <h3>${correct ? "Correct!" : "Not quite."} This is ${q.isScam ? "a scam." : "legit."}</h3>
    <p>${escapeHtml(q.explain)}</p>
    <button class="btn btn-primary" id="next-btn">${index + 1 < QUIZ_QUESTIONS.length ? "Next question →" : "See my results"}</button>`;
  const next = document.getElementById("next-btn");
  next.focus();
  next.addEventListener("click", () => {
    index++;
    index < QUIZ_QUESTIONS.length ? renderQuestion() : renderResults();
  });
}

function renderResults() {
  const total = QUIZ_QUESTIONS.length;
  const pct = score / total;
  const verdict =
    pct === 1 ? "Scam-proof! But remember: scammers adapt, so stay alert."
    : pct >= 0.7 ? "Great instincts! A few tricky ones got through, so review the warning signs."
    : pct >= 0.4 ? "Not bad, but scammers would get you sometimes. Check out the scam types page."
    : "Scammers would have a field day. Don't worry, that's why this site exists. Start with the warning signs.";

  quizEl().innerHTML = `
    <div class="card center">
      <p>Your score</p>
      <div class="score-big">${score}/${total}</div>
      <p class="lead" style="margin:12px auto">${verdict}</p>
      <div class="btn-row" style="justify-content:center">
        <button class="btn btn-primary" id="share-btn">Challenge your friends</button>
        <button class="btn btn-ghost" id="retry-btn">Try again</button>
        <a class="btn btn-ghost" href="warning-signs.html">Learn the warning signs</a>
      </div>
      <p id="share-msg" class="source"></p>
    </div>`;

  document.getElementById("retry-btn").addEventListener("click", () => {
    index = 0;
    score = 0;
    renderQuestion();
  });

  document.getElementById("share-btn").addEventListener("click", async () => {
    const text = `I scored ${score}/${total} on the "Spot the Scam" quiz. Can you beat me?`;
    const url = location.href;
    if (navigator.share) {
      try { await navigator.share({ title: "Spot the Scam", text, url }); } catch (e) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      document.getElementById("share-msg").textContent = "Copied! Paste it in your group chat.";
    } catch (e) {
      document.getElementById("share-msg").textContent = `${text} ${url}`;
    }
  });
}

document.addEventListener("DOMContentLoaded", renderQuestion);
