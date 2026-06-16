import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnnotatedVideoCreator, requireAuth } from "./annotationAuth";
import { getFormattedTimestamp } from "./utils";

const annotatedVideoValidator = v.object({
  _id: v.id("annotatedVideo"),
  _creationTime: v.number(),
  sourceKey: v.string(),
  sourceType: v.union(v.literal("youtube"), v.literal("local")),
  title: v.string(),
  youtubeId: v.optional(v.string()),
  youtubeUrl: v.optional(v.string()),
  eventKey: v.optional(v.string()),
  matchKey: v.optional(v.string()),
  compLevel: v.optional(v.string()),
  matchNumber: v.optional(v.number()),
  localLabel: v.optional(v.string()),
  aiSummary: v.optional(v.string()),
  createdBySubject: v.string(),
  createdAt: v.string(),
  updatedAt: v.string(),
});

const annotatedVideoSummaryValidator = v.object({
  _id: v.id("annotatedVideo"),
  title: v.string(),
  sourceType: v.union(v.literal("youtube"), v.literal("local")),
  youtubeId: v.optional(v.string()),
  localLabel: v.optional(v.string()),
  eventKey: v.optional(v.string()),
  matchKey: v.optional(v.string()),
  compLevel: v.optional(v.string()),
  matchNumber: v.optional(v.number()),
  updatedAt: v.string(),
  annotationCount: v.number(),
});

function buildYoutubeSourceKey(youtubeId: string) {
  return `youtube:${youtubeId}`;
}

function buildLocalSourceKey() {
  return `local:${crypto.randomUUID()}`;
}

function buildTitle(args: {
  sourceType: "youtube" | "local";
  youtubeId?: string;
  localLabel?: string;
  eventKey?: string;
  compLevel?: string;
  matchNumber?: number;
}) {
  if (args.eventKey && args.compLevel && args.matchNumber !== undefined) {
    const level = args.compLevel.toUpperCase();
    return `${args.eventKey} — ${level} ${args.matchNumber}`;
  }
  if (args.sourceType === "local" && args.localLabel) {
    return args.localLabel;
  }
  if (args.youtubeId) {
    return `YouTube — ${args.youtubeId}`;
  }
  return "Untitled video";
}

export const getAnnotatedVideo = query({
  args: { annotatedVideoId: v.id("annotatedVideo") },
  returns: v.union(annotatedVideoValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.annotatedVideoId);
  },
});

export const listMyAnnotatedVideos = query({
  args: {},
  returns: v.array(annotatedVideoSummaryValidator),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const videos = await ctx.db
      .query("annotatedVideo")
      .withIndex("by_creator_and_updated", (q) =>
        q.eq("createdBySubject", identity.subject)
      )
      .order("desc")
      .collect();

    const summaries = await Promise.all(
      videos.map(async (video) => {
        const annotations = await ctx.db
          .query("annotations")
          .withIndex("by_annotated_video", (q) =>
            q.eq("annotatedVideoId", video._id)
          )
          .collect();

        return {
          _id: video._id,
          title: video.title,
          sourceType: video.sourceType,
          youtubeId: video.youtubeId,
          localLabel: video.localLabel,
          eventKey: video.eventKey,
          matchKey: video.matchKey,
          compLevel: video.compLevel,
          matchNumber: video.matchNumber,
          updatedAt: video.updatedAt,
          annotationCount: annotations.length,
        };
      })
    );

    return summaries;
  },
});

export const getOrCreateAnnotatedVideo = mutation({
  args: {
    sourceType: v.union(v.literal("youtube"), v.literal("local")),
    youtubeId: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    localLabel: v.optional(v.string()),
    eventKey: v.optional(v.string()),
    matchKey: v.optional(v.string()),
    compLevel: v.optional(v.string()),
    matchNumber: v.optional(v.number()),
    title: v.optional(v.string()),
  },
  returns: v.id("annotatedVideo"),
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const now = getFormattedTimestamp();

    let sourceKey: string;
    if (args.sourceType === "youtube") {
      if (!args.youtubeId) {
        throw new Error("YouTube ID is required");
      }
      sourceKey = buildYoutubeSourceKey(args.youtubeId);
    } else {
      sourceKey = buildLocalSourceKey();
    }

    const existing = await ctx.db
      .query("annotatedVideo")
      .withIndex("by_source_key", (q) => q.eq("sourceKey", sourceKey))
      .unique();

    if (existing) {
      const patch: Record<string, string | number | undefined> = {
        updatedAt: now,
      };
      if (args.eventKey) patch.eventKey = args.eventKey;
      if (args.matchKey) patch.matchKey = args.matchKey;
      if (args.compLevel) patch.compLevel = args.compLevel;
      if (args.matchNumber !== undefined) patch.matchNumber = args.matchNumber;

      if (Object.keys(patch).length > 1) {
        await ctx.db.patch(existing._id, patch);
      } else {
        await ctx.db.patch(existing._id, { updatedAt: now });
      }

      return existing._id;
    }

    const title =
      args.title?.trim() ||
      buildTitle({
        sourceType: args.sourceType,
        youtubeId: args.youtubeId,
        localLabel: args.localLabel,
        eventKey: args.eventKey,
        compLevel: args.compLevel,
        matchNumber: args.matchNumber,
      });

    return await ctx.db.insert("annotatedVideo", {
      sourceKey,
      sourceType: args.sourceType,
      title,
      youtubeId: args.youtubeId,
      youtubeUrl: args.youtubeUrl,
      eventKey: args.eventKey,
      matchKey: args.matchKey,
      compLevel: args.compLevel,
      matchNumber: args.matchNumber,
      localLabel: args.localLabel,
      createdBySubject: identity.subject,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const saveAnnotatedVideoSummary = mutation({
  args: {
    annotatedVideoId: v.id("annotatedVideo"),
    summary: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const video = await ctx.db.get(args.annotatedVideoId);
    if (!video) {
      throw new Error("Annotated video not found");
    }

    const trimmedSummary = args.summary.trim();
    if (!trimmedSummary) {
      throw new Error("Summary is required");
    }

    await ctx.db.patch(args.annotatedVideoId, {
      aiSummary: trimmedSummary,
      updatedAt: getFormattedTimestamp(),
    });

    return null;
  },
});

export const deleteAnnotatedVideoSummary = mutation({
  args: { annotatedVideoId: v.id("annotatedVideo") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const video = await ctx.db.get(args.annotatedVideoId);
    if (!video) {
      throw new Error("Annotated video not found");
    }

    if (!video.aiSummary) {
      return null;
    }

    await ctx.db.patch(args.annotatedVideoId, {
      aiSummary: undefined,
      updatedAt: getFormattedTimestamp(),
    });

    return null;
  },
});

export const removeAnnotatedVideo = mutation({
  args: { annotatedVideoId: v.id("annotatedVideo") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAnnotatedVideoCreator(ctx, args.annotatedVideoId);

    const annotations = await ctx.db
      .query("annotations")
      .withIndex("by_annotated_video", (q) =>
        q.eq("annotatedVideoId", args.annotatedVideoId)
      )
      .collect();

    for (const annotation of annotations) {
      const replies = await ctx.db
        .query("annotationReplies")
        .withIndex("by_annotation", (q) => q.eq("annotationId", annotation._id))
        .collect();

      for (const reply of replies) {
        await ctx.db.delete(reply._id);
      }

      await ctx.db.delete(annotation._id);
    }

    await ctx.db.delete(args.annotatedVideoId);

    return null;
  },
});
