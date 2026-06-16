import AppSpringboard from "@/components/home/AppSpringboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return <AppSpringboard />;
}
