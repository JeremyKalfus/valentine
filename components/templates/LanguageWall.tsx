import Link from "next/link";

import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: YesPage;
  nextRandomHref: string;
};

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

function buildLanguageWallText(phrases: string[]) {
  const pieces: string[] = [];
  let charCount = 0;

  while (charCount < 19000) {
    for (const phrase of phrases) {
      const fragment = `${phrase}  •  `;
      pieces.push(fragment);
      charCount += fragment.length;
      if (charCount >= 19000) {
        break;
      }
    }
  }

  return pieces.join("");
}

export default function LanguageWall({ page, nextRandomHref }: Props) {
  const phrases =
    page.languagePhrases && page.languagePhrases.length > 0
      ? page.languagePhrases
      : DEFAULT_LANGUAGE_PHRASES;

  return (
    <div className="yes-shell language-wall-mode">
      <section className="language-wall" aria-hidden="true">
        <p className="language-wall-text">{buildLanguageWallText(phrases)}</p>
      </section>

      <div className="yes-actions fixed-actions">
        <Link className="yes-action-btn" href={nextRandomHref}>
          {page.buttonText || "Another random page"}
        </Link>
        <Link className="yes-action-link" href="/">
          Back to first page
        </Link>
      </div>
    </div>
  );
}
