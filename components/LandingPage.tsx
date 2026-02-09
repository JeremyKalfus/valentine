"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const EDGE_PADDING = 16;
const AVOID_RADIUS = 170;
const RUN_STEP = 180;
const RUN_BOOST_STEP = 250;
const RUN_MIN_FROM_YES = 190;
const STUCK_DELTA = 2;

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function LandingPage() {
  const router = useRouter();
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noButton = noButtonRef.current;
    const yesButton = yesButtonRef.current;
    const cursorAura = cursorAuraRef.current;

    if (!noButton || !yesButton || !cursorAura) {
      return;
    }
    const noButtonEl: HTMLButtonElement = noButton;
    const yesButtonEl: HTMLButtonElement = yesButton;
    const cursorAuraEl: HTMLDivElement = cursorAura;

    const auraState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      scale: 0.75,
      targetScale: 0.75
    };

    function getNoMetrics() {
      const rect = noButtonEl.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        maxX: window.innerWidth - rect.width - EDGE_PADDING,
        maxY: window.innerHeight - rect.height - EDGE_PADDING
      };
    }

    function readNoPosition() {
      const rect = noButtonEl.getBoundingClientRect();
      const styledLeft = parseFloat(noButtonEl.style.left);
      const styledTop = parseFloat(noButtonEl.style.top);

      return {
        x: Number.isFinite(styledLeft) ? styledLeft : rect.left,
        y: Number.isFinite(styledTop) ? styledTop : rect.top
      };
    }

    function setNoPosition(x: number, y: number) {
      const metrics = getNoMetrics();
      const nextX = clamp(x, EDGE_PADDING, Math.max(EDGE_PADDING, metrics.maxX));
      const nextY = clamp(y, EDGE_PADDING, Math.max(EDGE_PADDING, metrics.maxY));

      noButtonEl.style.left = `${nextX}px`;
      noButtonEl.style.top = `${nextY}px`;

      return { x: nextX, y: nextY, width: metrics.width, height: metrics.height };
    }

    function pushAwayFromYes(x: number, y: number, width: number, height: number) {
      const yesRect = yesButtonEl.getBoundingClientRect();
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

    function runNoButton(pointerX?: number, pointerY?: number) {
      const previous = readNoPosition();
      const metrics = getNoMetrics();
      const centerX = previous.x + metrics.width / 2;
      const centerY = previous.y + metrics.height / 2;

      let unitX = Math.cos(randomInRange(0, Math.PI * 2));
      let unitY = Math.sin(randomInRange(0, Math.PI * 2));
      let step = RUN_STEP;

      if (Number.isFinite(pointerX) && Number.isFinite(pointerY)) {
        const dx = centerX - (pointerX ?? 0);
        const dy = centerY - (pointerY ?? 0);
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

    function handleNoEscape(event: Event) {
      event.preventDefault();
      if (event instanceof MouseEvent || event instanceof PointerEvent || event instanceof TouchEvent) {
        const clientX = "clientX" in event ? event.clientX : undefined;
        const clientY = "clientY" in event ? event.clientY : undefined;
        runNoButton(clientX, clientY);
      } else {
        runNoButton();
      }
    }

    function placeNoButtonDefault() {
      const metrics = getNoMetrics();
      const defaultX = window.innerWidth * 0.655 - metrics.width / 2;
      const defaultY = window.innerHeight * 0.704 - metrics.height / 2;
      setNoPosition(defaultX, defaultY);
    }

    function animateAura() {
      auraState.x += (auraState.targetX - auraState.x) * 0.18;
      auraState.y += (auraState.targetY - auraState.y) * 0.18;
      auraState.scale += (auraState.targetScale - auraState.scale) * 0.22;

      cursorAuraEl.style.transform = `translate(${auraState.x}px, ${auraState.y}px) translate(-50%, -50%) scale(${auraState.scale})`;

      window.requestAnimationFrame(animateAura);
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        const speed = Math.hypot(event.movementX || 0, event.movementY || 0);
        auraState.targetX = event.clientX;
        auraState.targetY = event.clientY;
        auraState.targetScale = clamp(0.82 + speed / 34, 0.82, 1.18);
        document.body.classList.add("cursor-active");
      }

      const rect = noButtonEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const pointerDistance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

      if (pointerDistance < AVOID_RADIUS) {
        runNoButton(event.clientX, event.clientY);
      }
    };

    const handlePointerLeave = () => {
      auraState.targetScale = 0.75;
      document.body.classList.remove("cursor-active");
    };

    const handleResize = () => {
      const position = readNoPosition();
      setNoPosition(position.x, position.y);
      auraState.targetX = clamp(auraState.targetX, 0, window.innerWidth);
      auraState.targetY = clamp(auraState.targetY, 0, window.innerHeight);
    };

    placeNoButtonDefault();
    animateAura();

    noButtonEl.addEventListener("mouseenter", handleNoEscape);
    noButtonEl.addEventListener("pointerdown", handleNoEscape);
    noButtonEl.addEventListener("touchstart", handleNoEscape, { passive: false });
    noButtonEl.addEventListener("click", handleNoEscape);

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      noButtonEl.removeEventListener("mouseenter", handleNoEscape);
      noButtonEl.removeEventListener("pointerdown", handleNoEscape);
      noButtonEl.removeEventListener("touchstart", handleNoEscape);
      noButtonEl.removeEventListener("click", handleNoEscape);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove("cursor-active");
    };
  }, []);

  return (
    <>
      <div className="cursor-aura" ref={cursorAuraRef} aria-hidden="true" />
      <main className="page">
        <h1 className="hero-title">
          Rebecca, will you be
          <br />
          my valentine?
        </h1>

        <button
          className="valentine-button yes-button"
          ref={yesButtonRef}
          type="button"
          aria-label="Yes"
          onClick={() => router.push("/yes/random")}
        >
          <span className="button-title">YES</span>
          <span className="button-subtitle">I love you Jeremy!</span>
        </button>

        <button className="valentine-button no-button" ref={noButtonRef} type="button" aria-label="No">
          <span className="button-title">NO</span>
          <span className="button-subtitle">You&apos;re chopped</span>
        </button>
      </main>
    </>
  );
}
