import Image from "next/image";
import Link from "next/link";

const BALL_COUNTER_HREF = "/ball-counter";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between max-w-7xl">
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/rebuilt-logo.svg"
            alt="Rebuilt Logo"
            width={100}
            height={50}
          />
          <span className="font-sans font-semibold text-xl">
            Scouting Tools
          </span>
        </div>
        <Link
          className="text-sm font-medium text-ink-muted transition hover:text-ink"
          href={{ pathname: BALL_COUNTER_HREF }}
        >
          Ball Counter
        </Link>
      </div>
    </header>
  );
}
