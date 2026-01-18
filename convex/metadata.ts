import { v } from "convex/values"
import { httpAction, mutation, query } from "./_generated/server"
import { api, internal } from "./_generated/api"
import { formatISO } from "date-fns";

export const createMetadata = mutation({
    args: {
        eventCode: v.string(),
        matchNumber: v.string(),
        teamNumber: v.number(),
        videoUrl: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const timestamp = formatISO(new Date());
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
