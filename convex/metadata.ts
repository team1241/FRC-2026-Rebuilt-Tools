import { v } from "convex/values"
import { httpAction, mutation, MutationCtx, query } from "./_generated/server"
import { api } from "./_generated/api"
import { getFormattedTimestamp } from "./utils";
import { Doc } from "./_generated/dataModel";

export type CreateMetadataPayload = Pick<Doc<"metadata">, "userName" | "eventCode" | "matchNumber" | "teamNumber" | "videoUrl" | 'bps'>

export const writeMetadata = async (ctx: MutationCtx, metadata: CreateMetadataPayload, timestamp?: string) => {
  const _timestamp = timestamp ?? getFormattedTimestamp()
  return await ctx.db.insert('metadata', { ...metadata, createdAt: _timestamp, updatedAt: _timestamp })
}

export const createMetadata = mutation({
  args: {
    userName: v.string(),
    eventCode: v.string(),
    matchNumber: v.string(),
    teamNumber: v.number(),
    videoUrl: v.string(),
    bps: v.number()
  },
  handler: async (ctx, args) => {
    const timestamp = getFormattedTimestamp();
    const metadata = await ctx.db.insert("metadata", {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp
    })
    return metadata;
  }
})

export const getMetadata = query({
  handler: async (ctx) => {
    return await ctx.db.query("metadata").order('desc').collect()

  }
})

export const getMetadataById = query({
  args: {
    metadataId: v.id("metadata")
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("metadata").filter((q) => q.eq(q.field("_id"), args.metadataId)).collect()
  }
})

export const getMetadataHttp = httpAction(
  async (ctx) => {
    const metadataList = await ctx.runQuery(api.metadata.getMetadata)
    return new Response(JSON.stringify({ metadata: metadataList }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  })
