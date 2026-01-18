import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Hero() {
  const metadata = useQuery(api.metadata.getMetadata);
  return (
    <header className="space-y-2">
      <h1 className="text-4xl font-semibold leading-tight text-[var(--color-ink)] md:text-5xl">
        Ball Counter
      </h1>
      <p className="text-base text-[var(--color-ink-muted)] md:text-lg">
        Step through any match clip, tag every shot, and get instant
        ball-per-second stats.
      </p>
    </header>
  );
}
