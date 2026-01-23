import { redirect } from "next/navigation";

const BALL_COUNTER_HREF = "/ball-counter" as const;

export default function HomePage() {
  redirect(BALL_COUNTER_HREF as Parameters<typeof redirect>[0]);
}
