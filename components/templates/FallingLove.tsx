"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: YesPage;
  nextRandomHref: string;
};

type FallingItem = {
  id: number;
  left: number;
  tilt: number;
  driftX: number;
  duration: number;
};

const MAX_ACTIVE_TEXT = 52;
const LOVE_BURST_SIZE = 8;
const LOVE_INTERVAL_MS = 115;
const DEFAULT_LOVE_TEXT =
  "I love you sooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo much";

export default function FallingLove({ page, nextRandomHref }: Props) {
  const [items, setItems] = useState<FallingItem[]>([]);
  const timerRef = useRef<number | null>(null);
  const nextIdRef = useRef(0);

  const fallingText = page.fallingText?.trim() || DEFAULT_LOVE_TEXT;

  function spawnFallingText() {
    setItems((previous) => {
      if (previous.length >= MAX_ACTIVE_TEXT) {
        return previous;
      }

      const item: FallingItem = {
        id: nextIdRef.current++,
        left: Math.random() * 76 + 12,
        tilt: Math.random() * 12 - 6,
        driftX: Math.random() * 180 - 90,
        duration: Math.random() * 1.6 + 3.7
      };

      window.setTimeout(() => {
        setItems((current) => current.filter((entry) => entry.id !== item.id));
      }, item.duration * 1000 + 120);

      return [...previous, item];
    });
  }

  function burst() {
    for (let index = 0; index < LOVE_BURST_SIZE; index += 1) {
      spawnFallingText();
    }
  }

  function startRain() {
    if (timerRef.current !== null) {
      return;
    }

    burst();
    timerRef.current = window.setInterval(spawnFallingText, LOVE_INTERVAL_MS);
  }

  function stopRain() {
    if (timerRef.current === null) {
      return;
    }

    window.clearInterval(timerRef.current);
    timerRef.current = null;
  }

  useEffect(() => {
    const handlePointerUp = () => stopRain();
    const handleBlur = () => stopRain();

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("blur", handleBlur);
      stopRain();
    };
  }, []);

  return (
    <div className="template-shell">
      <div className="love-rain-layer" aria-hidden="true">
        {items.map((item) => {
          const style = {
            "--left": `${item.left}vw`,
            "--tilt": `${item.tilt}deg`,
            "--drift-x": `${item.driftX}px`,
            "--fall-duration": `${item.duration}s`
          } as CSSProperties;

          return (
            <p className="falling-love" style={style} key={item.id}>
              {fallingText}
            </p>
          );
        })}
      </div>

      <article className="note-card">
        <p className="note-kicker">Valentine Update</p>
        <h1 className="note-title">{page.title}</h1>
        {page.subtitle ? <h2 className="note-subtitle">{page.subtitle}</h2> : null}
        {page.body ? <p className="note-body">{page.body}</p> : null}

        <div className="actions">
          <button
            className="action-btn"
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              startRain();
            }}
            onTouchStart={(event) => {
              event.preventDefault();
              startRain();
            }}
            onClick={(event) => {
              event.preventDefault();
              burst();
            }}
          >
            {page.buttonText || "Press to rain text"}
          </button>
          <Link className="action-link-pill" href={nextRandomHref}>
            Next random page
          </Link>
          <Link className="action-link" href="/">
            Back to first page
          </Link>
        </div>
      </article>
    </div>
  );
}
