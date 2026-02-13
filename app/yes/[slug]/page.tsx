import FallingLove from "@/components/templates/FallingLove";
import FirstTextTimer from "@/components/templates/FirstTextTimer";
import LanguageWall from "@/components/templates/LanguageWall";
import NoteTemplate from "@/components/templates/NoteTemplate";
import PhotoGallery from "@/components/templates/PhotoGallery";
import YesPageScaffold from "@/components/templates/YesPageScaffold";
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
      <YesPageScaffold page={{ buttonText: "Try another random page" }} nextRandomHref="/yes/random">
        <main className="yes-shell">
          <section className="yes-card">
            <h1 className="yes-title">This page was not found.</h1>
            <p className="yes-body">The selected valentine page does not exist yet.</p>
          </section>
        </main>
      </YesPageScaffold>
    );
  }

  const nextRandomHref = `/yes/random?except=${encodeURIComponent(page.slug)}`;

  if (page.template === "falling-love") {
    return (
      <YesPageScaffold page={page} nextRandomHref={nextRandomHref}>
        <FallingLove page={page} />
      </YesPageScaffold>
    );
  }

  if (page.template === "language-wall") {
    return (
      <YesPageScaffold page={page} nextRandomHref={nextRandomHref}>
        <LanguageWall page={page} />
      </YesPageScaffold>
    );
  }

  if (page.template === "first-text-timer") {
    return (
      <YesPageScaffold page={page} nextRandomHref={nextRandomHref}>
        <FirstTextTimer page={page} />
      </YesPageScaffold>
    );
  }

  if (page.template === "photo-gallery") {
    return (
      <YesPageScaffold page={page} nextRandomHref={nextRandomHref}>
        <PhotoGallery page={page} />
      </YesPageScaffold>
    );
  }

  return (
    <YesPageScaffold page={page} nextRandomHref={nextRandomHref}>
      <NoteTemplate page={page} />
    </YesPageScaffold>
  );
}
