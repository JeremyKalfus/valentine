"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ANOTHER_PAGE_LABEL } from "@/lib/random-nav";

type Props = {
  nextRandomHref: string;
};

type ResolveResponse = {
  destination?: string;
  external?: boolean;
  fallbackDestination?: string;
};

function buildResolveHref(href: string) {
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}source=another&resolve=1`;
}

export default function AnotherRandomPageButton({ nextRandomHref }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(buildResolveHref(nextRandomHref), { cache: "no-store" });
      if (!response.ok) {
        router.push(nextRandomHref);
        return;
      }

      const result = (await response.json()) as ResolveResponse;
      if (result.external && result.destination) {
        const popup = window.open(result.destination, "_blank", "noopener,noreferrer");
        if (!popup) {
          window.location.href = result.destination;
          return;
        }
        router.push(result.fallbackDestination || nextRandomHref);
        return;
      }

      router.push(result.destination || nextRandomHref);
    } catch {
      router.push(nextRandomHref);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button className="yes-nav-btn" type="button" onClick={handleClick} disabled={isLoading}>
      {ANOTHER_PAGE_LABEL}
    </button>
  );
}
