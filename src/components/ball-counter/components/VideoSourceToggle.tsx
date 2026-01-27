import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type VideoSourceToggleProps = {
  value: "youtube" | "local";
  onChange: (value: "youtube" | "local") => void;
};

export default function VideoSourceToggle({
  value,
  onChange,
}: VideoSourceToggleProps) {
  const options = [
    { value: "youtube", label: "YouTube" },
    { value: "local", label: "Local" },
  ] as const;

  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) =>
        onChange(nextValue as VideoSourceToggleProps["value"])
      }
      className="w-fit"
    >
      <TabsList
        variant="line"
        className="flex flex-wrap gap-2 bg-transparent p-0"
      >
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
