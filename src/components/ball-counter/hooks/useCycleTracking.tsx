"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CycleUi } from "@/components/ball-counter/types";

type CycleTrackingContextValue = {
  cycles: CycleUi[];
  setCycles: React.Dispatch<React.SetStateAction<CycleUi[]>>;
  activeCycleStart: number | null;
  setActiveCycleStart: React.Dispatch<React.SetStateAction<number | null>>;
};

const CycleTrackingContext = createContext<CycleTrackingContextValue | null>(
  null,
);

type CycleTrackingProviderProps = {
  children: React.ReactNode;
};

export function CycleTrackingProvider({
  children,
}: CycleTrackingProviderProps) {
  const [cycles, setCycles] = useState<CycleUi[]>([]);
  const [activeCycleStart, setActiveCycleStart] = useState<number | null>(null);

  const value = useMemo(
    () => ({
      cycles,
      setCycles,
      activeCycleStart,
      setActiveCycleStart,
    }),
    [cycles, activeCycleStart],
  );

  return (
    <CycleTrackingContext.Provider value={value}>
      {children}
    </CycleTrackingContext.Provider>
  );
}

export default function useCycleTracking() {
  const context = useContext(CycleTrackingContext);
  if (!context) {
    throw new Error(
      "useCycleTracking must be used within CycleTrackingProvider",
    );
  }
  return context;
}
