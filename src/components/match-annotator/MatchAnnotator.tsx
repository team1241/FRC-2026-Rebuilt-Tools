"use client";

import MatchAnnotatorLayout from "@/components/match-annotator/MatchAnnotatorLayout";
import useMatchAnnotatorState from "@/components/match-annotator/hooks/useMatchAnnotatorState";

export default function MatchAnnotator() {
  const state = useMatchAnnotatorState();
  return <MatchAnnotatorLayout state={state} />;
}
