import Link from "next/link";

import FallingLove from "@/components/templates/FallingLove";
import FirstTextTimer from "@/components/templates/FirstTextTimer";
import LanguageWall from "@/components/templates/LanguageWall";
import NoteTemplate from "@/components/templates/NoteTemplate";
import { getYesPageBySlug } from "@/lib/yes-pages";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function YesSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getYesPageBySlug(slug);

  if (!page) {
    return (
      <main className="yes-shell">
        <section className="yes-card">
          <h1 className="yes-title">This page was not found.</h1>
          <p className="yes-body">The selected valentine page does not exist yet.</p>
          <div className="yes-actions">
            <Link className="yes-action-btn" href="/yes/random">
              Try another random page
            </Link>
            <Link className="yes-action-link" href="/">
              Back to first page
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const nextRandomHref = `/yes/random?except=${encodeURIComponent(page.slug)}`;

  if (page.template === "falling-love") {
    return <FallingLove page={page} nextRandomHref={nextRandomHref} />;
  }

  if (page.template === "language-wall") {
    return <LanguageWall page={page} nextRandomHref={nextRandomHref} />;
  }

  if (page.template === "first-text-timer") {
    return <FirstTextTimer page={page} nextRandomHref={nextRandomHref} />;
  }

  return <NoteTemplate page={page} nextRandomHref={nextRandomHref} />;
}
