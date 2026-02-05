const noButton = document.getElementById("noBtn");
const yesButton = document.getElementById("yesBtn");
const yesMessage = document.getElementById("yesMessage");

const EDGE_PADDING = 16;
const AVOID_RADIUS = 150;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function putNoButtonAt(x, y) {
  const rect = noButton.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - EDGE_PADDING;
  const maxY = window.innerHeight - rect.height - EDGE_PADDING;

  const nextX = clamp(x, EDGE_PADDING, Math.max(EDGE_PADDING, maxX));
  const nextY = clamp(y, EDGE_PADDING, Math.max(EDGE_PADDING, maxY));

  noButton.style.left = `${nextX}px`;
  noButton.style.top = `${nextY}px`;
}

function placeNoButtonDefault() {
  const rect = noButton.getBoundingClientRect();
  const defaultX = window.innerWidth * 0.655 - rect.width / 2;
  const defaultY = window.innerHeight * 0.704 - rect.height / 2;
  putNoButtonAt(defaultX, defaultY);
}

function moveNoButtonAway(pointerX = null, pointerY = null) {
  const rect = noButton.getBoundingClientRect();
  const yesRect = yesButton.getBoundingClientRect();

  const maxX = window.innerWidth - rect.width - EDGE_PADDING;
  const maxY = window.innerHeight - rect.height - EDGE_PADDING;

  let chosenX = EDGE_PADDING;
  let chosenY = EDGE_PADDING;

  for (let i = 0; i < 25; i += 1) {
    const candidateX = randomInRange(EDGE_PADDING, Math.max(EDGE_PADDING, maxX));
    const candidateY = randomInRange(EDGE_PADDING, Math.max(EDGE_PADDING, maxY));

    const centerX = candidateX + rect.width / 2;
    const centerY = candidateY + rect.height / 2;

    const yesCenterX = yesRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top + yesRect.height / 2;

    const awayFromYes = Math.hypot(centerX - yesCenterX, centerY - yesCenterY) > 190;
    const awayFromPointer =
      pointerX === null || pointerY === null
        ? true
        : Math.hypot(centerX - pointerX, centerY - pointerY) > AVOID_RADIUS;

    if (awayFromYes && awayFromPointer) {
      chosenX = candidateX;
      chosenY = candidateY;
      break;
    }
  }

  putNoButtonAt(chosenX, chosenY);
}

function handleNoPress(event) {
  event.preventDefault();
  moveNoButtonAway(event.clientX ?? null, event.clientY ?? null);
}

noButton.addEventListener("mouseenter", handleNoPress);
noButton.addEventListener("pointerdown", handleNoPress);
noButton.addEventListener("touchstart", handleNoPress, { passive: false });
noButton.addEventListener("click", handleNoPress);

document.addEventListener("pointermove", (event) => {
  const rect = noButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const pointerDistance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

  if (pointerDistance < AVOID_RADIUS) {
    moveNoButtonAway(event.clientX, event.clientY);
  }
});

yesButton.addEventListener("click", () => {
  yesMessage.classList.add("show");
});

window.addEventListener("resize", () => {
  const left = parseFloat(noButton.style.left);
  const top = parseFloat(noButton.style.top);

  if (Number.isFinite(left) && Number.isFinite(top)) {
    putNoButtonAt(left, top);
  } else {
    placeNoButtonDefault();
  }
});

placeNoButtonDefault();
