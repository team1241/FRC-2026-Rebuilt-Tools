"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MatchPhaseTabsProps = {
  value: "auto" | "teleop";
  onChange: (value: "auto" | "teleop") => void;
};

const options = [
  { value: "auto", label: "Auto" },
  { value: "teleop", label: "Teleop" },
] as const;

export default function MatchPhaseTabs({
  value,
  onChange,
}: MatchPhaseTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) =>
        onChange(nextValue as MatchPhaseTabsProps["value"])
      }
      className="w-fit"
    >
      <TabsList
        variant="line"
        className="flex flex-wrap gap-2 bg-transparent p-0"
        aria-label="Match phase"
      >
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className="h-auto rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] data-[state=active]:border-accent data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:border-border data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
