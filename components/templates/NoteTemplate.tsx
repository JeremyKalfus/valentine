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
        <h1 className="yes-title">{page.title}</h1>
        {page.markdown ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.markdown}</ReactMarkdown> : null}

      </article>
    </div>
  );
}
