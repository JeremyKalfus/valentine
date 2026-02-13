import { describe, expect, it } from "vitest";

import { EASTER_EGG_LINKS, pickEasterEggLink } from "../lib/random-nav";

function fromValues(values: number[]) {
  let index = 0;
  return () => {
    const value = values[index] ?? values[values.length - 1] ?? 0;
    index += 1;
    return value;
  };
}

describe("random nav easter egg helper", () => {
  it("does not trigger when roll misses", () => {
    const link = pickEasterEggLink(fromValues([0.88]));
    expect(link).toBeNull();
  });

  it("returns first link on hit with low index roll", () => {
    const link = pickEasterEggLink(fromValues([0, 0]));
    expect(link).toBe(EASTER_EGG_LINKS[0]);
  });

  it("returns a valid link when hit with high index roll", () => {
    const link = pickEasterEggLink(fromValues([0, 0.9999]));
    expect(EASTER_EGG_LINKS).toContain(link);
    expect(link).toBe(EASTER_EGG_LINKS[EASTER_EGG_LINKS.length - 1]);
  });
});
