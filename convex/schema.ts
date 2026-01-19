import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  metadata: defineTable({
    eventCode: v.string(),
    matchNumber: v.string(),
    teamNumber: v.number(),
    videoUrl: v.string(),
    userId: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  cycles: defineTable({
    metadataId: v.id("metadata"),
    cycleNumber: v.number(),
    startTimestamp: v.string(),
    endTimestamp: v.string(),
    numberOfBalls: v.number(),
    cycleType: v.union(v.literal('feeding'), v.literal('shooting')),
    createdAt: v.string(),
    updatedAt: v.string()
  }).index("by_metadata", ["metadataId"])
})