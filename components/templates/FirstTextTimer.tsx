"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: YesPage;
  nextRandomHref: string;
};

type TimerParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const DEFAULT_START_ISO = "2025-11-17T00:21:00-05:00";

function padTwo(value: number) {
  return String(value).padStart(2, "0");
}

function calculateElapsed(startDate: Date, nowMs: number): TimerParts {
  const diffMs = Math.max(0, nowMs - startDate.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

export default function FirstTextTimer({ page, nextRandomHref }: Props) {
  const startIso = page.startIso || DEFAULT_START_ISO;
  const startDate = useMemo(() => new Date(startIso), [startIso]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const elapsed = useMemo(() => calculateElapsed(startDate, nowMs), [nowMs, startDate]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [startDate]);

  const timestamp = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(startDate);

  return (
    <div className="yes-shell">
      <article className="yes-card">
        <p className="yes-kicker">Valentine Update</p>
        <h1 className="yes-title">{page.title}</h1>
        {page.subtitle ? <h2 className="yes-subtitle">{page.subtitle}</h2> : null}
        {page.body ? <p className="yes-body">{page.body}</p> : null}

        <section className="time-since" aria-live="polite">
          <p className="time-label">Time passed since your first text:</p>
          <div className="time-grid">
            <div className="time-cell">
              <p className="time-value">{elapsed.days}</p>
              <p className="time-unit">Days</p>
            </div>
            <div className="time-cell">
              <p className="time-value">{padTwo(elapsed.hours)}</p>
              <p className="time-unit">Hours</p>
            </div>
            <div className="time-cell">
              <p className="time-value">{padTwo(elapsed.minutes)}</p>
              <p className="time-unit">Minutes</p>
            </div>
            <div className="time-cell">
              <p className="time-value">{padTwo(elapsed.seconds)}</p>
              <p className="time-unit">Seconds</p>
            </div>
          </div>
          <div className="text-log">
            <p className="text-line">
              <span className="text-person">Rebecca:</span> &quot;
              {page.firstTextFromRebecca || "hello"}&quot;
            </p>
            <p className="text-line">
              <span className="text-person">You:</span> &quot;{page.firstTextFromMe || "who's this"}
              &quot;
            </p>
            <p className="text-stamp">{timestamp} (America/New_York)</p>
          </div>
        </section>

        <div className="yes-actions">
          <Link className="yes-action-btn" href={nextRandomHref}>
            {page.buttonText || "Another random page"}
          </Link>
          <Link className="yes-action-link" href="/">
            Back to first page
          </Link>
        </div>
      </article>
    </div>
  );
}
