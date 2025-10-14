"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function FacebookPixelRouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // @ts-expect-error - Expect error here
    window.fbq?.("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}
