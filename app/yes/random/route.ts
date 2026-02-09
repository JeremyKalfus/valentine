import { NextRequest, NextResponse } from "next/server";

import { getRandomYesPage } from "@/lib/yes-pages";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const except = request.nextUrl.searchParams.get("except") || undefined;
  const page = getRandomYesPage(except);
  const destination = page ? `/yes/${encodeURIComponent(page.slug)}` : "/yes/empty";

  return NextResponse.redirect(new URL(destination, request.url));
}
