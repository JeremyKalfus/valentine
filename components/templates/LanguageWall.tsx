import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: YesPage;
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
const MIN_WALL_CHAR_COUNT = 52000;

function buildLanguageWallText(phrases: string[]) {
  const pieces: string[] = [];
  let charCount = 0;

  while (charCount < MIN_WALL_CHAR_COUNT) {
    for (const phrase of phrases) {
      const fragment = `${phrase}  •  `;
      pieces.push(fragment);
      charCount += fragment.length;
      if (charCount >= MIN_WALL_CHAR_COUNT) {
        break;
      }
    }
  }

  return pieces.join("");
}

export default function LanguageWall({ page }: Props) {
  const phrases =
    page.languagePhrases && page.languagePhrases.length > 0
      ? page.languagePhrases
      : DEFAULT_LANGUAGE_PHRASES;

  return (
    <div className="yes-shell language-wall-mode">
      <section className="language-wall-scroll" aria-label="I love you language wall">
        <div className="language-wall" aria-hidden="true">
          <p className="language-wall-text">{buildLanguageWallText(phrases)}</p>
        </div>
      </section>
    </div>
  );
}
