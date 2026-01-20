"use client";

import type { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex =
  convexUrl && convexUrl.length > 0 ? new ConvexReactClient(convexUrl) : null;

export default function Providers({ children }: { children: ReactNode }) {
  if (!convex) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center text-sm text-(--color-ink-muted)">
        Missing `NEXT_PUBLIC_CONVEX_URL` env variable.
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <Toaster richColors position="top-right" />
      {children}
    </ConvexProvider>
  );
}
