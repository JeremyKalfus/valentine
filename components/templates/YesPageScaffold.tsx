import Link from "next/link";
import type { ReactNode } from "react";

import type { YesPage } from "@/lib/yes-pages";

type Props = {
  page: Pick<YesPage, "buttonText">;
  nextRandomHref: string;
  children: ReactNode;
};

export default function YesPageScaffold({ page, nextRandomHref, children }: Props) {
  return (
    <>
      {children}
      <nav className="yes-nav-bar" aria-label="Random page navigation">
        <Link className="yes-nav-btn" href={nextRandomHref}>
          {page.buttonText || "Another random page"}
        </Link>
        <Link className="yes-nav-link" href="/">
          Back to first page
        </Link>
      </nav>
    </>
  );
}
