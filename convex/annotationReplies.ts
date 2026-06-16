import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  requireAnnotationReplyAuthor,
  requireAuth,
} from "./annotationAuth";
import { getFormattedTimestamp } from "./utils";

const annotationReplyValidator = v.object({
  _id: v.id("annotationReplies"),
  _creationTime: v.number(),
  annotationId: v.id("annotations"),
  authorSubject: v.string(),
  authorName: v.optional(v.string()),
  text: v.string(),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export const listAnnotationReplies = query({
  args: { annotationId: v.id("annotations") },
  returns: v.array(annotationReplyValidator),
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query("annotationReplies")
      .withIndex("by_annotation", (q) => q.eq("annotationId", args.annotationId))
      .collect();

    return replies.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },
});

export const createAnnotationReply = mutation({
  args: {
    annotationId: v.id("annotations"),
    text: v.string(),
    authorName: v.optional(v.string()),
  },
  returns: v.id("annotationReplies"),
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const annotation = await ctx.db.get(args.annotationId);
    if (!annotation) {
      throw new Error("Annotation not found");
    }

    const trimmedText = args.text.trim();
    if (!trimmedText) {
      throw new Error("Reply text is required");
    }

    const now = getFormattedTimestamp();

    const replyId = await ctx.db.insert("annotationReplies", {
      annotationId: args.annotationId,
      authorSubject: identity.subject,
      authorName: args.authorName?.trim() || identity.name || undefined,
      text: trimmedText,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(annotation.annotatedVideoId, { updatedAt: now });

    return replyId;
  },
});

export const updateAnnotationReply = mutation({
  args: {
    replyId: v.id("annotationReplies"),
    text: v.string(),
  },
  returns: v.id("annotationReplies"),
  handler: async (ctx, args) => {
    await requireAnnotationReplyAuthor(ctx, args.replyId);

    const trimmedText = args.text.trim();
    if (!trimmedText) {
      throw new Error("Reply text is required");
    }

    await ctx.db.patch(args.replyId, {
      text: trimmedText,
      updatedAt: getFormattedTimestamp(),
    });

    return args.replyId;
  },
});

export const removeAnnotationReply = mutation({
  args: { replyId: v.id("annotationReplies") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAnnotationReplyAuthor(ctx, args.replyId);
    await ctx.db.delete(args.replyId);
    return null;
  },
});
