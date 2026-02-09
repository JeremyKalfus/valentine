import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: YesPage;
  nextRandomHref: string;
};

export default function NoteTemplate({ page, nextRandomHref }: Props) {
  return (
    <div className="template-shell">
      <article className="note-card">
        <p className="note-kicker">Valentine Update</p>
        <h1 className="note-title">{page.title}</h1>
        {page.subtitle ? <h2 className="note-subtitle">{page.subtitle}</h2> : null}
        {page.body ? <p className="note-body">{page.body}</p> : null}
        {page.markdown ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.markdown}</ReactMarkdown> : null}

        <div className="actions">
          <Link className="action-link-pill" href={nextRandomHref}>
            {page.buttonText || "Another random page"}
          </Link>
          <Link className="action-link" href="/">
            Back to first page
          </Link>
        </div>
      </article>
    </div>
  );
}
