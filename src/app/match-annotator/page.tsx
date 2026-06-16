import MatchAnnotator from "@/components/match-annotator/MatchAnnotator";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Match Annotator",
};

export default function MatchAnnotatorPage() {
  return (
    <Suspense fallback={null}>
      <MatchAnnotator />
    </Suspense>
  );
}
