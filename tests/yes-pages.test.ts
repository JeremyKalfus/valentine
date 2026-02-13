import { describe, expect, it } from "vitest";

import { getAllYesPages, getRandomYesPage, getYesPageBySlug } from "../lib/yes-pages";

describe("yes-pages loader", () => {
  it("loads all markdown yes pages", () => {
    const pages = getAllYesPages();

    expect(pages.length).toBeGreaterThanOrEqual(5);
    expect(pages.map((page) => page.slug)).toEqual(
      expect.arrayContaining([
        "love-rain",
        "language-wall",
        "heart-wall",
        "first-text-timer",
        "photo-memories"
      ])
    );
  });

  it("gets timer page by slug", () => {
    const timerPage = getYesPageBySlug("first-text-timer");

    expect(timerPage).not.toBeNull();
    expect(timerPage?.template).toBe("first-text-timer");
    expect(timerPage?.startIso).toBe("2025-11-17T00:21:00-05:00");
  });

  it("avoids immediate repeats when randomizing with except", () => {
    for (let idx = 0; idx < 25; idx += 1) {
      const randomPage = getRandomYesPage("love-rain");
      expect(randomPage).not.toBeNull();
      expect(randomPage?.slug).not.toBe("love-rain");
    }
  });
});
