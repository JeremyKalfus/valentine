import Link from "next/link";
import type { ReactNode } from "react";

import { ANOTHER_PAGE_LABEL } from "@/lib/random-nav";

type Props = {
  nextRandomHref: string;
  children: ReactNode;
};

function withAnotherSource(href: string) {
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}source=another`;
}

export default function YesPageScaffold({ nextRandomHref, children }: Props) {
  return (
    <>
      {children}
      <nav className="yes-nav-bar" aria-label="Random page navigation">
        <Link className="yes-nav-btn" href={withAnotherSource(nextRandomHref)}>
          {ANOTHER_PAGE_LABEL}
        </Link>
        <Link className="yes-nav-link" href="/">
          Back to first page
        </Link>
      </nav>
    </>
  );
}
