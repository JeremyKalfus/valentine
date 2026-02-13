import { NextRequest, NextResponse } from "next/server";

import { pickEasterEggLink } from "@/lib/random-nav";
import { getRandomYesPage } from "@/lib/yes-pages";

export const dynamic = "force-dynamic";

function getInternalDestination(except?: string) {
  const page = getRandomYesPage(except);
  return page ? `/yes/${encodeURIComponent(page.slug)}` : "/yes/empty";
}

export function GET(request: NextRequest) {
  const except = request.nextUrl.searchParams.get("except") || undefined;
  const source = request.nextUrl.searchParams.get("source");
  const resolve = request.nextUrl.searchParams.get("resolve");

  if (resolve === "1") {
    if (source === "another") {
      const easterEggLink = pickEasterEggLink();
      if (easterEggLink) {
        return NextResponse.json({
          destination: easterEggLink,
          external: true,
          fallbackDestination: getInternalDestination(except)
        });
      }
    }

    return NextResponse.json({
      destination: getInternalDestination(except),
      external: false
    });
  }

  if (source === "another") {
    const easterEggLink = pickEasterEggLink();
    if (easterEggLink) {
      return NextResponse.redirect(new URL(easterEggLink));
    }
  }

  return NextResponse.redirect(new URL(getInternalDestination(except), request.url));
}
