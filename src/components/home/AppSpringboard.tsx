import Link from "next/link";
import Hero from "@/components/common/Hero";
import { APP_LINKS } from "@/components/common/header/constants";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

export default function AppSpringboard() {
  return (
    <div className="flex flex-col gap-8 py-4">
      <Hero text="Scouting Tools" />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {APP_LINKS.map((app) => (
          <li key={app.href}>
            <Link
              href={{ pathname: app.href }}
              className="group flex h-full flex-col gap-3 rounded-[28px] border border-border bg-card p-6 transition-[background-color,border-color,transform] duration-200 hover:border-primary/30 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-foreground text-balance">
                  {app.label}
                </h2>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="size-5 shrink-0 text-muted-foreground transition group-hover:text-primary"
                  aria-hidden
                />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {app.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
