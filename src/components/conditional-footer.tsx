"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/app/components/Footer";

const HIDDEN_FOOTER_PAGES = ["/game-setup"];

export function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on specified pages
  if (HIDDEN_FOOTER_PAGES.some((page) => pathname?.startsWith(page))) {
    return null;
  }

  return <Footer />;
}

