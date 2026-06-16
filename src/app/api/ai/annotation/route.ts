import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { formatTimecodeRange } from "@/components/match-annotator/utils/format-timecode";
import { getAuthenticatedConvexClient } from "@/lib/convex-server";
import { auth } from "@clerk/nextjs/server";
import { gateway, generateText, Output, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from '@ai-sdk/devtools';
import { z } from "zod";

const requestSchema = z.object({
  annotatedVideoId: z.string().min(1),
});

const summarySchema = z.object({
  summary: z
    .string()
    .describe(
      "A brief coach debrief for the drive team: short, direct, actionable feedback drawn from the annotations"
    ),
});

function formatAuthorName(authorName?: string) {
  return authorName?.trim() || "Anonymous";
}

function buildAnnotationPrompt(context: {
  videoTitle: string;
  eventKey?: string;
  compLevel?: string;
  matchNumber?: number;
  annotations: Array<{
    text: string;
    authorName?: string;
    startTimeSeconds: number;
    endTimeSeconds?: number;
    replies: Array<{ text: string; authorName?: string }>;
  }>;
}) {
  const matchDetails = [
    context.eventKey,
    context.compLevel && context.matchNumber !== undefined
      ? `${context.compLevel.toUpperCase()} ${context.matchNumber}`
      : undefined,
  ]
    .filter(Boolean)
    .join(" — ");

  const header = [
    `Video: ${context.videoTitle}`,
    matchDetails ? `Match: ${matchDetails}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const annotationBlocks = context.annotations.map((annotation, index) => {
    const timecode = formatTimecodeRange(
      annotation.startTimeSeconds,
      annotation.endTimeSeconds
    );
    const replyLines =
      annotation.replies.length > 0
        ? annotation.replies
          .map(
            (reply, replyIndex) =>
              `  Reply ${replyIndex + 1} (${formatAuthorName(reply.authorName)}): ${reply.text}`
          )
          .join("\n")
        : "  (no replies)";

    return [
      `Annotation ${index + 1} [${timecode}] (${formatAuthorName(annotation.authorName)}): ${annotation.text}`,
      replyLines,
    ].join("\n");
  });

  return [
    header,
    "",
    "Annotations and replies:",
    annotationBlocks.join("\n\n"),
  ].join("\n");
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "annotatedVideoId is required" },
      { status: 400 }
    );
  }

  const convex = await getAuthenticatedConvexClient();
  const context = await convex.query(api.annotations.getAnnotationSummaryContext, {
    annotatedVideoId: parsed.data.annotatedVideoId as Id<"annotatedVideo">,
  });

  if (!context) {
    return Response.json({ error: "Annotated video not found" }, { status: 404 });
  }

  if (context.annotations.length === 0) {
    return Response.json({
      summary:
        "No annotations have been added to this match video yet, so there is nothing to summarize.",
    });
  }

  const model = wrapLanguageModel({
    model: gateway('openai/gpt-5.4-mini'),
    middleware: devToolsMiddleware(),
  });

  const { output } = await generateText({
    model,
    output: Output.object({ schema: summarySchema }),
    system:
      "You write brief post-match debriefs for a FIRST Robotics coach to share with the drive team. Write the feedback to read at a grade 10 level. DO not use EM dashes or other formatting, just use plain text. Use the annotations and replies to produce short, direct feedback—not a scouting report or play-by-play. Prioritize what the drivers should keep doing, fix, or try next match. Use plain language, use as few words as possible, and prefer a few tight bullet points over paragraphs. Create a final key takeaway section at the end of the summary. Omit timestamps, author names, and repeated points. Do not speculate beyond what the notes support.",
    prompt: buildAnnotationPrompt(context),
  });

  return Response.json({ summary: output.summary });
}
