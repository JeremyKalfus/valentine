import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: YesPage;
};

const HEART_PHRASES = ["💖", "💕", "💗", "❤️", "💝", "🫀"];
const MIN_WALL_CHAR_COUNT = 52000;

function buildHeartWallText() {
  const pieces: string[] = [];
  let charCount = 0;

  while (charCount < MIN_WALL_CHAR_COUNT) {
    for (const heart of HEART_PHRASES) {
      const fragment = `${heart}  `;
      pieces.push(fragment);
      charCount += fragment.length;
      if (charCount >= MIN_WALL_CHAR_COUNT) {
        break;
      }
    }
  }

  return pieces.join("");
}

export default function HeartWall({ page }: Props) {
  return (
    <div className="yes-shell language-wall-mode">
      <section className="language-wall-scroll" aria-label={`${page.title} heart wall`}>
        <div className="language-wall" aria-hidden="true">
          <p className="language-wall-text">{buildHeartWallText()}</p>
        </div>
      </section>
    </div>
  );
}
