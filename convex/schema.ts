import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  metadata: defineTable({
    userName: v.string(),
    eventCode: v.string(),
    matchNumber: v.string(),
    teamNumber: v.number(),
    videoUrl: v.string(),
    bps: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  cycles: defineTable({
    metadataId: v.id("metadata"),
    cycleNumber: v.number(),
    startTimestamp: v.number(),
    endTimestamp: v.number(),
    numberOfBalls: v.number(),
    bps: v.number(),
    cycleType: v.union(v.literal('feeding'), v.literal('shooting')),
    createdAt: v.string(),
    updatedAt: v.string()
  }).index("by_metadata", ["metadataId"])
})
