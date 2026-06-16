import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

type AuthCtx = QueryCtx | MutationCtx;

export async function requireAuth(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export async function requireAnnotationAuthor(
  ctx: MutationCtx,
  annotationId: Id<"annotations">
) {
  const identity = await requireAuth(ctx);
  const annotation = await ctx.db.get(annotationId);
  if (!annotation) {
    throw new Error("Annotation not found");
  }
  if (annotation.authorSubject !== identity.subject) {
    throw new Error("Not authorized to modify this annotation");
  }
  return { identity, annotation };
}

export async function requireAnnotationReplyAuthor(
  ctx: MutationCtx,
  replyId: Id<"annotationReplies">
) {
  const identity = await requireAuth(ctx);
  const reply = await ctx.db.get(replyId);
  if (!reply) {
    throw new Error("Reply not found");
  }
  if (reply.authorSubject !== identity.subject) {
    throw new Error("Not authorized to modify this reply");
  }
  return { identity, reply };
}

export async function requireAnnotatedVideoCreator(
  ctx: MutationCtx,
  annotatedVideoId: Id<"annotatedVideo">
) {
  const identity = await requireAuth(ctx);
  const video = await ctx.db.get(annotatedVideoId);
  if (!video) {
    throw new Error("Annotated video not found");
  }
  if (video.createdBySubject !== identity.subject) {
    throw new Error("Not authorized to delete this annotated video");
  }
  return { identity, video };
}
