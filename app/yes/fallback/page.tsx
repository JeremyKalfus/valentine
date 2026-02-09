import Link from "next/link";

export default function FallbackPage() {
  return (
    <main className="yes-shell">
      <article className="yes-card">
        <p className="yes-kicker">Valentine Update</p>
        <h1 className="yes-title">No pages configured yet.</h1>
        <p className="yes-body">Add an MDX file to content/yes-pages to enable random yes pages.</p>
        <div className="yes-actions">
          <Link className="yes-action-btn" href="/">
            Back home
          </Link>
        </div>
      </article>
    </main>
  );
}
