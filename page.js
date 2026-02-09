const pagesApi = window.ValentinePages || null;

const titleEl = document.getElementById("noteTitle");
const subtitleEl = document.getElementById("noteSubtitle");
const noteBodyEl = document.getElementById("noteBody");
const againBtn = document.getElementById("randomAgainBtn");
const nextRandomLink = document.getElementById("nextRandomLink");
const rainLayer = document.getElementById("loveRainLayer");
const languageWallText = document.getElementById("languageWallText");
const timeDaysEl = document.getElementById("timeDays");
const timeHoursEl = document.getElementById("timeHours");
const timeMinutesEl = document.getElementById("timeMinutes");
const timeSecondsEl = document.getElementById("timeSeconds");
const rebeccaFirstTextEl = document.getElementById("rebeccaFirstText");
const myFirstTextEl = document.getElementById("myFirstText");
const firstTextStampEl = document.getElementById("firstTextStamp");

const MAX_ACTIVE_TEXT = 52;
const LOVE_BURST_SIZE = 8;
const LOVE_INTERVAL_MS = 115;
const DEFAULT_LOVE_TEXT =
  "I love you sooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo much";
const DEFAULT_LANGUAGE_PHRASES = [
  "I love you",
  "Je t'aime",
  "Te quiero",
  "Te amo",
  "Ti amo",
  "Ich liebe dich",
  "Eu te amo",
  "Ik hou van je",
  "Jag alskar dig",
  "Jeg elsker deg",
  "Jeg elsker dig",
  "Kocham cie",
  "Miluji te",
  "Te iubesc",
  "S'agapo",
  "Seni seviyorum",
  "Ana uhibbuka",
  "Ani ohevet otkha",
  "Ya tebya lyublyu",
  "Ya tebe kokhayu",
  "Main tumse pyaar karta hoon",
  "Ami tomake bhalobashi",
  "Wo ai ni",
  "Ai shiteru",
  "Saranghae",
  "Phom rak khun",
  "Toi yeu ban",
  "Aku cinta kamu",
  "Mahal kita",
  "Nakupenda",
  "Ngiyakuthanda"
];

let currentPage = null;
let rainTimer = null;
let activeTextCount = 0;
let elapsedTimer = null;

function readRequestedPage() {
  const params = new URLSearchParams(window.location.search);
  return params.get("page");
}

function applyPage(page) {
  titleEl.textContent = page.title;
  subtitleEl.textContent = page.subtitle;
  noteBodyEl.textContent = page.body;
  againBtn.textContent = page.buttonText || "Show me another";
}

function navigateToPage(page) {
  window.location.href = `./page.html?page=${encodeURIComponent(page.id)}`;
}

function getRandomPage(exceptId) {
  if (!pagesApi || typeof pagesApi.getRandomPage !== "function") {
    return null;
  }

  return pagesApi.getRandomPage(exceptId);
}

function getPageById(id) {
  if (!pagesApi || typeof pagesApi.getPageById !== "function") {
    return null;
  }

  return pagesApi.getPageById(id);
}

function setNextRandomLink() {
  const next = getRandomPage(currentPage ? currentPage.id : null);
  if (!next) {
    nextRandomLink.classList.remove("show-link");
    nextRandomLink.classList.add("hidden-link");
    return;
  }

  nextRandomLink.href = `./page.html?page=${encodeURIComponent(next.id)}`;
  nextRandomLink.classList.remove("hidden-link");
  nextRandomLink.classList.add("show-link");
}

function spawnFallingLoveText(text) {
  if (!rainLayer || activeTextCount >= MAX_ACTIVE_TEXT) {
    return;
  }

  const node = document.createElement("p");
  node.className = "falling-love";
  node.textContent = text;

  node.style.setProperty("--left", `${Math.random() * 76 + 12}vw`);
  node.style.setProperty("--tilt", `${Math.random() * 12 - 6}deg`);
  node.style.setProperty("--drift-x", `${Math.random() * 180 - 90}px`);
  node.style.setProperty("--fall-duration", `${Math.random() * 1.6 + 3.7}s`);

  rainLayer.appendChild(node);
  activeTextCount += 1;

  node.addEventListener("animationend", () => {
    node.remove();
    activeTextCount = Math.max(0, activeTextCount - 1);
  });
}

function burstLoveText(text, amount) {
  for (let i = 0; i < amount; i += 1) {
    spawnFallingLoveText(text);
  }
}

function startLoveRain(text) {
  if (rainTimer) {
    return;
  }

  burstLoveText(text, LOVE_BURST_SIZE);
  rainTimer = window.setInterval(() => {
    spawnFallingLoveText(text);
  }, LOVE_INTERVAL_MS);
}

function stopLoveRain() {
  if (!rainTimer) {
    return;
  }

  window.clearInterval(rainTimer);
  rainTimer = null;
}

function enableFallingLoveMode(page) {
  const rainText = page.fallingText || DEFAULT_LOVE_TEXT;

  document.body.classList.add("love-rain-mode");
  setNextRandomLink();

  const start = (event) => {
    event.preventDefault();
    startLoveRain(rainText);
  };

  const burst = (event) => {
    event.preventDefault();
    burstLoveText(rainText, LOVE_BURST_SIZE);
  };

  againBtn.addEventListener("pointerdown", start);
  againBtn.addEventListener("touchstart", start, { passive: false });
  againBtn.addEventListener("click", burst);

  window.addEventListener("pointerup", stopLoveRain);
  window.addEventListener("pointercancel", stopLoveRain);
  window.addEventListener("blur", stopLoveRain);
}

function buildLanguageWallText(phrases) {
  const usable = Array.isArray(phrases) && phrases.length > 0 ? phrases : DEFAULT_LANGUAGE_PHRASES;
  const pieces = [];
  let charCount = 0;

  while (charCount < 19000) {
    for (let i = 0; i < usable.length; i += 1) {
      const fragment = `${usable[i]}  \u2022  `;
      pieces.push(fragment);
      charCount += fragment.length;
      if (charCount >= 19000) {
        break;
      }
    }
  }

  return pieces.join("");
}

function enableLanguageWallMode(page) {
  document.body.classList.add("language-wall-mode");
  setNextRandomLink();

  if (languageWallText) {
    languageWallText.textContent = buildLanguageWallText(page.languagePhrases);
  }

  againBtn.addEventListener("click", () => {
    const next = getRandomPage(currentPage ? currentPage.id : null);
    if (next) {
      navigateToPage(next);
    }
  });
}

function toLocalStartDate(startLocal) {
  if (!startLocal) {
    return new Date(2025, 10, 17, 0, 21, 0, 0);
  }

  return new Date(
    startLocal.year,
    (startLocal.month || 1) - 1,
    startLocal.day || 1,
    startLocal.hour || 0,
    startLocal.minute || 0,
    startLocal.second || 0,
    0
  );
}

function padTwo(value) {
  return String(value).padStart(2, "0");
}

function renderElapsed(startDate) {
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - startDate.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timeDaysEl.textContent = String(days);
  timeHoursEl.textContent = padTwo(hours);
  timeMinutesEl.textContent = padTwo(minutes);
  timeSecondsEl.textContent = padTwo(seconds);
}

function enableFirstTextTimerMode(page) {
  document.body.classList.add("timer-mode");
  setNextRandomLink();

  const startDate = toLocalStartDate(page.startLocal);
  const stamp = startDate.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  if (page.firstText && typeof page.firstText === "object") {
    rebeccaFirstTextEl.textContent = page.firstText.fromRebecca || "hello";
    myFirstTextEl.textContent = page.firstText.fromMe || "who's this";
  }
  firstTextStampEl.textContent = stamp;

  renderElapsed(startDate);
  elapsedTimer = window.setInterval(() => {
    renderElapsed(startDate);
  }, 1000);

  window.addEventListener("beforeunload", () => {
    if (elapsedTimer) {
      window.clearInterval(elapsedTimer);
      elapsedTimer = null;
    }
  });

  againBtn.addEventListener("click", () => {
    const next = getRandomPage(currentPage ? currentPage.id : null);
    if (next) {
      navigateToPage(next);
    }
  });
}

function enableDefaultMode() {
  againBtn.addEventListener("click", () => {
    const next = getRandomPage(currentPage ? currentPage.id : null);
    if (next) {
      navigateToPage(next);
    }
  });
}

const requestedId = readRequestedPage();
currentPage = getPageById(requestedId) || getRandomPage();

if (!currentPage) {
  currentPage = {
    id: "love-rain",
    template: "falling-love",
    title: "Press and hold.",
    subtitle: "Then watch it rain.",
    body: "When you press the button, the page drops the love line in title style across the whole screen.",
    buttonText: "Press to rain text",
    fallingText: DEFAULT_LOVE_TEXT
  };
}

applyPage(currentPage);

if (currentPage.template === "falling-love") {
  enableFallingLoveMode(currentPage);
} else if (currentPage.template === "language-wall") {
  enableLanguageWallMode(currentPage);
} else if (currentPage.template === "first-text-timer") {
  enableFirstTextTimerMode(currentPage);
} else {
  enableDefaultMode();
}
