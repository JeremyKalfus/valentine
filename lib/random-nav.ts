export const ANOTHER_PAGE_LABEL = "Another random page";
export const EASTER_EGG_ODDS = 100;

// Add more external easter egg links here.
export const EASTER_EGG_LINKS = [
  "https://www.youtube.com/watch?v=XXYlFuWEuKI&list=RDEMHSpo_Uv9STIRtF73zMywLg&start_radio=1",
  "https://www.youtube.com/watch?v=dEWCJZQjjhI&list=RDEMHSpo_Uv9STIRtF73zMywLg&index=2",
  "https://www.youtube.com/watch?v=16jA-6hiSUo&list=RDEMHSpo_Uv9STIRtF73zMywLg&index=12",
  "https://www.youtube.com/watch?v=MmOau-PMWJk&list=RDMmOau-PMWJk&start_radio=1",
  "https://www.youtube.com/watch?v=mFNaFeIm4bU&list=RDmFNaFeIm4bU&start_radio=1"
];

export function pickEasterEggLink(rand: () => number = Math.random): string | null {
  if (EASTER_EGG_LINKS.length === 0) {
    return null;
  }

  const roll = Math.floor(rand() * EASTER_EGG_ODDS);
  if (roll !== 0) {
    return null;
  }

  const index = Math.min(EASTER_EGG_LINKS.length - 1, Math.floor(rand() * EASTER_EGG_LINKS.length));
  return EASTER_EGG_LINKS[index] ?? null;
}
