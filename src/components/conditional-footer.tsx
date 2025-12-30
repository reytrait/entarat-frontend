"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/app/components/Footer";

const HIDDEN_FOOTER_PAGES = ["/game-setup", "/login", "/register"];

export function ConditionalFooter() {
  const pathname = usePathname();
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    // Check if we're on a 404 page by looking for the data attribute
    const check404 = () => {
      const isNotFound =
        document.documentElement.getAttribute("data-page") === "not-found";
      setIs404(isNotFound);
    };

    check404();
    // Check periodically in case the attribute is set after mount
    const interval = setInterval(check404, 100);
    return () => clearInterval(interval);
  }, []);

  // Hide footer on specified pages or 404 pages
  if (HIDDEN_FOOTER_PAGES.some((page) => pathname?.startsWith(page)) || is404) {
    return null;
  }

  return <Footer />;
}
