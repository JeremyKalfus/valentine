const pagesApi = window.ValentinePages || null;

const noButton = document.getElementById("noBtn");
const yesButton = document.getElementById("yesBtn");
const cursorAura = document.getElementById("cursorAura");

const EDGE_PADDING = 16;
const AVOID_RADIUS = 170;
const RUN_STEP = 180;
const RUN_BOOST_STEP = 250;
const RUN_MIN_FROM_YES = 190;
const STUCK_DELTA = 2;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getNoMetrics() {
  const rect = noButton.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    maxX: window.innerWidth - rect.width - EDGE_PADDING,
    maxY: window.innerHeight - rect.height - EDGE_PADDING
  };
}

function readNoPosition() {
  const rect = noButton.getBoundingClientRect();
  const styledLeft = parseFloat(noButton.style.left);
  const styledTop = parseFloat(noButton.style.top);

  return {
    x: Number.isFinite(styledLeft) ? styledLeft : rect.left,
    y: Number.isFinite(styledTop) ? styledTop : rect.top
  };
}

function setNoPosition(x, y) {
  const metrics = getNoMetrics();
  const nextX = clamp(x, EDGE_PADDING, Math.max(EDGE_PADDING, metrics.maxX));
  const nextY = clamp(y, EDGE_PADDING, Math.max(EDGE_PADDING, metrics.maxY));

  noButton.style.left = `${nextX}px`;
  noButton.style.top = `${nextY}px`;

  return { x: nextX, y: nextY, width: metrics.width, height: metrics.height };
}

function pushAwayFromYes(x, y, width, height) {
  const yesRect = yesButton.getBoundingClientRect();
  const candidateCenterX = x + width / 2;
  const candidateCenterY = y + height / 2;
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;

  const dx = candidateCenterX - yesCenterX;
  const dy = candidateCenterY - yesCenterY;
  const distance = Math.hypot(dx, dy);

  if (distance >= RUN_MIN_FROM_YES) {
    return { x, y };
  }

  const safeDistance = distance || 1;
  const push = RUN_MIN_FROM_YES - safeDistance + 18;
  const pushedCenterX = candidateCenterX + (dx / safeDistance) * push;
  const pushedCenterY = candidateCenterY + (dy / safeDistance) * push;

  return {
    x: pushedCenterX - width / 2,
    y: pushedCenterY - height / 2
  };
}

function runNoButton(pointerX, pointerY) {
  const previous = readNoPosition();
  const metrics = getNoMetrics();
  const centerX = previous.x + metrics.width / 2;
  const centerY = previous.y + metrics.height / 2;

  let unitX = Math.cos(randomInRange(0, Math.PI * 2));
  let unitY = Math.sin(randomInRange(0, Math.PI * 2));
  let step = RUN_STEP;

  if (Number.isFinite(pointerX) && Number.isFinite(pointerY)) {
    const dx = centerX - pointerX;
    const dy = centerY - pointerY;
    const distance = Math.hypot(dx, dy) || 1;
    unitX = dx / distance;
    unitY = dy / distance;
    step = distance < 90 ? RUN_BOOST_STEP : RUN_STEP;
  }

  const rawTargetX = previous.x + unitX * step;
  const rawTargetY = previous.y + unitY * step;
  const pushedTarget = pushAwayFromYes(rawTargetX, rawTargetY, metrics.width, metrics.height);
  const applied = setNoPosition(pushedTarget.x, pushedTarget.y);

  const movement = Math.hypot(applied.x - previous.x, applied.y - previous.y);
  if (movement >= STUCK_DELTA) {
    return;
  }

  const angle = randomInRange(0, Math.PI * 2);
  const sidestepX = previous.x + Math.cos(angle) * RUN_BOOST_STEP;
  const sidestepY = previous.y + Math.sin(angle) * RUN_BOOST_STEP;
  const sidestepTarget = pushAwayFromYes(sidestepX, sidestepY, metrics.width, metrics.height);
  setNoPosition(sidestepTarget.x, sidestepTarget.y);
}

function handleNoEscape(event) {
  event.preventDefault();
  runNoButton(event.clientX, event.clientY);
}

function placeNoButtonDefault() {
  const metrics = getNoMetrics();
  const defaultX = window.innerWidth * 0.655 - metrics.width / 2;
  const defaultY = window.innerHeight * 0.704 - metrics.height / 2;
  setNoPosition(defaultX, defaultY);
}

function goToRandomPage() {
  if (pagesApi && typeof pagesApi.getRandomPage === "function") {
    const next = pagesApi.getRandomPage();
    if (next) {
      window.location.href = `./page.html?page=${encodeURIComponent(next.id)}`;
      return;
    }
  }

  window.location.href = "./page.html?page=love-rain";
}

const auraState = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  targetX: window.innerWidth / 2,
  targetY: window.innerHeight / 2,
  scale: 0.75,
  targetScale: 0.75
};

function animateAura() {
  if (!cursorAura) {
    return;
  }

  auraState.x += (auraState.targetX - auraState.x) * 0.18;
  auraState.y += (auraState.targetY - auraState.y) * 0.18;
  auraState.scale += (auraState.targetScale - auraState.scale) * 0.22;

  cursorAura.style.transform =
    `translate(${auraState.x}px, ${auraState.y}px) translate(-50%, -50%) scale(${auraState.scale})`;

  window.requestAnimationFrame(animateAura);
}

noButton.addEventListener("mouseenter", handleNoEscape);
noButton.addEventListener("pointerdown", handleNoEscape);
noButton.addEventListener("touchstart", handleNoEscape, { passive: false });
noButton.addEventListener("click", handleNoEscape);

document.addEventListener("pointermove", (event) => {
  if (cursorAura && event.pointerType !== "touch") {
    const speed = Math.hypot(event.movementX || 0, event.movementY || 0);
    auraState.targetX = event.clientX;
    auraState.targetY = event.clientY;
    auraState.targetScale = clamp(0.82 + speed / 34, 0.82, 1.18);
    document.body.classList.add("cursor-active");
  }

  const rect = noButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const pointerDistance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

  if (pointerDistance < AVOID_RADIUS) {
    runNoButton(event.clientX, event.clientY);
  }
});

document.addEventListener("pointerleave", () => {
  if (!cursorAura) {
    return;
  }

  auraState.targetScale = 0.75;
  document.body.classList.remove("cursor-active");
});

yesButton.addEventListener("click", goToRandomPage);

window.addEventListener("resize", () => {
  const position = readNoPosition();
  setNoPosition(position.x, position.y);
  auraState.targetX = clamp(auraState.targetX, 0, window.innerWidth);
  auraState.targetY = clamp(auraState.targetY, 0, window.innerHeight);
});

placeNoButtonDefault();
animateAura();
