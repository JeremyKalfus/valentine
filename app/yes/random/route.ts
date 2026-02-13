import { NextRequest, NextResponse } from "next/server";

import { pickEasterEggLink } from "@/lib/random-nav";
import { getRandomYesPage } from "@/lib/yes-pages";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const except = request.nextUrl.searchParams.get("except") || undefined;
  const source = request.nextUrl.searchParams.get("source");

  if (source === "another") {
    const easterEggLink = pickEasterEggLink();
    if (easterEggLink) {
      return NextResponse.redirect(new URL(easterEggLink));
    }
  }

  const page = getRandomYesPage(except);
  const destination = page ? `/yes/${encodeURIComponent(page.slug)}` : "/yes/empty";

  return NextResponse.redirect(new URL(destination, request.url));
}
