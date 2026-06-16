import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnnotationAuthor, requireAuth } from "./annotationAuth";
import { getFormattedTimestamp } from "./utils";

const annotationValidator = v.object({
  _id: v.id("annotations"),
  _creationTime: v.number(),
  annotatedVideoId: v.id("annotatedVideo"),
  authorSubject: v.string(),
  authorName: v.optional(v.string()),
  text: v.string(),
  startTimeSeconds: v.number(),
  endTimeSeconds: v.optional(v.number()),
  createdAt: v.string(),
  updatedAt: v.string(),
});

const annotationReplySummaryValidator = v.object({
  text: v.string(),
  authorName: v.optional(v.string()),
});

const annotationWithRepliesValidator = v.object({
  text: v.string(),
  authorName: v.optional(v.string()),
  startTimeSeconds: v.number(),
  endTimeSeconds: v.optional(v.number()),
  replies: v.array(annotationReplySummaryValidator),
});

export const getAnnotationSummaryContext = query({
  args: { annotatedVideoId: v.id("annotatedVideo") },
  returns: v.union(
    v.object({
      videoTitle: v.string(),
      eventKey: v.optional(v.string()),
      compLevel: v.optional(v.string()),
      matchNumber: v.optional(v.number()),
      annotations: v.array(annotationWithRepliesValidator),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.annotatedVideoId);
    if (!video) {
      return null;
    }

    const annotations = await ctx.db
      .query("annotations")
      .withIndex("by_annotated_video_and_start", (q) =>
        q.eq("annotatedVideoId", args.annotatedVideoId)
      )
      .collect();

    const annotationsWithReplies = await Promise.all(
      annotations.map(async (annotation) => {
        const replies = await ctx.db
          .query("annotationReplies")
          .withIndex("by_annotation", (q) =>
            q.eq("annotationId", annotation._id)
          )
          .collect();

        replies.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        return {
          text: annotation.text,
          authorName: annotation.authorName,
          startTimeSeconds: annotation.startTimeSeconds,
          endTimeSeconds: annotation.endTimeSeconds,
          replies: replies.map((reply) => ({
            text: reply.text,
            authorName: reply.authorName,
          })),
        };
      })
    );

    return {
      videoTitle: video.title,
      eventKey: video.eventKey,
      compLevel: video.compLevel,
      matchNumber: video.matchNumber,
      annotations: annotationsWithReplies.sort(
        (a, b) => a.startTimeSeconds - b.startTimeSeconds
      ),
    };
  },
});

export const listAnnotations = query({
  args: { annotatedVideoId: v.id("annotatedVideo") },
  returns: v.array(annotationValidator),
  handler: async (ctx, args) => {
    const annotations = await ctx.db
      .query("annotations")
      .withIndex("by_annotated_video_and_start", (q) =>
        q.eq("annotatedVideoId", args.annotatedVideoId)
      )
      .collect();

    return annotations.sort(
      (a, b) => a.startTimeSeconds - b.startTimeSeconds
    );
  },
});

export const createAnnotation = mutation({
  args: {
    annotatedVideoId: v.id("annotatedVideo"),
    text: v.string(),
    startTimeSeconds: v.number(),
    endTimeSeconds: v.optional(v.number()),
    authorName: v.optional(v.string()),
  },
  returns: v.id("annotations"),
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const video = await ctx.db.get(args.annotatedVideoId);
    if (!video) {
      throw new Error("Annotated video not found");
    }

    const trimmedText = args.text.trim();
    if (!trimmedText) {
      throw new Error("Annotation text is required");
    }

    if (
      args.endTimeSeconds !== undefined &&
      args.endTimeSeconds < args.startTimeSeconds
    ) {
      throw new Error("End time must be after start time");
    }

    const now = getFormattedTimestamp();

    const annotationId = await ctx.db.insert("annotations", {
      annotatedVideoId: args.annotatedVideoId,
      authorSubject: identity.subject,
      authorName: args.authorName?.trim() || identity.name || undefined,
      text: trimmedText,
      startTimeSeconds: args.startTimeSeconds,
      endTimeSeconds: args.endTimeSeconds,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(args.annotatedVideoId, { updatedAt: now });

    return annotationId;
  },
});

export const updateAnnotation = mutation({
  args: {
    annotationId: v.id("annotations"),
    text: v.string(),
    startTimeSeconds: v.optional(v.number()),
    endTimeSeconds: v.optional(v.number()),
  },
  returns: v.id("annotations"),
  handler: async (ctx, args) => {
    const { annotation } = await requireAnnotationAuthor(ctx, args.annotationId);

    const trimmedText = args.text.trim();
    if (!trimmedText) {
      throw new Error("Annotation text is required");
    }

    const startTimeSeconds =
      args.startTimeSeconds ?? annotation.startTimeSeconds;
    const endTimeSeconds =
      args.endTimeSeconds !== undefined
        ? args.endTimeSeconds
        : annotation.endTimeSeconds;

    if (endTimeSeconds !== undefined && endTimeSeconds < startTimeSeconds) {
      throw new Error("End time must be after start time");
    }

    const now = getFormattedTimestamp();

    await ctx.db.patch(args.annotationId, {
      text: trimmedText,
      startTimeSeconds,
      endTimeSeconds,
      updatedAt: now,
    });

    await ctx.db.patch(annotation.annotatedVideoId, { updatedAt: now });

    return args.annotationId;
  },
});

export const removeAnnotation = mutation({
  args: { annotationId: v.id("annotations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { annotation } = await requireAnnotationAuthor(ctx, args.annotationId);

    const replies = await ctx.db
      .query("annotationReplies")
      .withIndex("by_annotation", (q) => q.eq("annotationId", args.annotationId))
      .collect();

    for (const reply of replies) {
      await ctx.db.delete(reply._id);
    }

    await ctx.db.delete(args.annotationId);
    await ctx.db.patch(annotation.annotatedVideoId, {
      updatedAt: getFormattedTimestamp(),
    });

    return null;
  },
});
