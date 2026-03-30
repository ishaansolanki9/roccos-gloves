"use client";

import { RouteError } from "@/components/ui/route-error";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="We couldn't load that page"
      description="A temporary problem interrupted the storefront. Please try again."
      reset={reset}
    />
  );
}
