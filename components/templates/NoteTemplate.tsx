import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: YesPage;
};

export default function NoteTemplate({ page }: Props) {
  return (
    <div className="yes-shell">
      <article className="yes-card">
        <p className="yes-kicker">Valentine Update</p>
        <h1 className="yes-title">{page.title}</h1>
        {page.subtitle ? <h2 className="yes-subtitle">{page.subtitle}</h2> : null}
        {page.body ? <p className="yes-body">{page.body}</p> : null}
        {page.markdown ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.markdown}</ReactMarkdown> : null}

      </article>
    </div>
  );
}
