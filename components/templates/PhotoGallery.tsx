import fs from "node:fs";
import path from "node:path";
import type { CSSProperties } from "react";
import Image from "next/image";

import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: YesPage;
};

const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".gif"]);

const HEART_CONFIG = [
  { x: "8%", y: "84%", size: "26px", delay: "0s", duration: "12s" },
  { x: "18%", y: "76%", size: "18px", delay: "-2s", duration: "14s" },
  { x: "28%", y: "88%", size: "24px", delay: "-4s", duration: "13s" },
  { x: "38%", y: "72%", size: "22px", delay: "-3s", duration: "15s" },
  { x: "50%", y: "86%", size: "20px", delay: "-6s", duration: "12s" },
  { x: "60%", y: "78%", size: "16px", delay: "-1s", duration: "14s" },
  { x: "70%", y: "90%", size: "28px", delay: "-5s", duration: "16s" },
  { x: "80%", y: "74%", size: "19px", delay: "-7s", duration: "13s" },
  { x: "92%", y: "82%", size: "23px", delay: "-2.5s", duration: "14.5s" },
  { x: "12%", y: "68%", size: "17px", delay: "-8s", duration: "15s" },
  { x: "44%", y: "66%", size: "21px", delay: "-9s", duration: "13.5s" },
  { x: "76%", y: "64%", size: "25px", delay: "-10s", duration: "16.5s" }
] as const;

function getPhotos(photoDir?: string) {
  const normalizedDir = (photoDir || "memories").replace(/^\/+|\/+$/g, "");
  if (normalizedDir.includes("..")) {
    return [];
  }
  const diskDir = path.join(process.cwd(), "public", "assets", normalizedDir);

  if (!fs.existsSync(diskDir)) {
    return [];
  }

  return fs
    .readdirSync(diskDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => PHOTO_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => ({
      fileName,
      src: `/assets/${normalizedDir}/${encodeURIComponent(fileName)}`
    }));
}

export default function PhotoGallery({ page }: Props) {
  const photos = getPhotos(page.photoDir);

  return (
    <div className="yes-shell photo-gallery-mode">
      <div className="photo-hearts-layer" aria-hidden="true">
        {HEART_CONFIG.map((heart, index) => (
          <span
            key={`${heart.x}-${heart.y}-${index}`}
            className="photo-heart"
            style={
              {
                "--heart-x": heart.x,
                "--heart-y": heart.y,
                "--heart-size": heart.size,
                "--heart-delay": heart.delay,
                "--heart-duration": heart.duration
              } as CSSProperties
            }
          />
        ))}
      </div>
      <section className="photo-gallery-scroll" aria-label="Photo memories gallery">
        <article className="photo-gallery-content">
          <h1 className="yes-title photo-gallery-title">{page.title}</h1>
          {photos.length === 0 ? (
            <p className="yes-body">
              Add images to <code>public/assets/{page.photoDir || "memories"}</code> and they will appear here
              automatically.
            </p>
          ) : (
            <div className="photo-gallery-grid">
              {photos.map((photo, index) => (
                <figure className="photo-gallery-card" key={photo.fileName}>
                  <Image
                    src={photo.src}
                    alt={`Memory ${index + 1}`}
                    width={900}
                    height={1200}
                    className="photo-gallery-image"
                    sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 28vw"
                    priority={index < 3}
                  />
                </figure>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
