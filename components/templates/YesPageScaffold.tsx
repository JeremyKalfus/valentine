import Link from "next/link";
import type { ReactNode } from "react";

import AnotherRandomPageButton from "@/components/templates/AnotherRandomPageButton";

type Props = {
  nextRandomHref: string;
  children: ReactNode;
};

export default function YesPageScaffold({ nextRandomHref, children }: Props) {
  return (
    <>
      {children}
      <nav className="yes-nav-bar" aria-label="Random page navigation">
        <AnotherRandomPageButton nextRandomHref={nextRandomHref} />
        <Link className="yes-nav-link" href="/">
          Back to first page
        </Link>
      </nav>
    </>
  );
}
