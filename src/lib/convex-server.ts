import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

let client: ConvexHttpClient | null = null;

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  }

  client ??= new ConvexHttpClient(url);
  return client;
}

export async function getAuthenticatedConvexClient() {
  const convex = getConvexClient();
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (token) {
    convex.setAuth(token);
  }
  return convex;
}
