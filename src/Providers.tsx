import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(
    import.meta.env.VITE_CONVEX_URL as string,
  );

  return (
    <ConvexProvider client={convex}>
      <Toaster richColors position="top-right" />
      {children}
    </ConvexProvider>
  );
}
