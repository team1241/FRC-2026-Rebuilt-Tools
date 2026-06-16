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
  }).index("by_metadata", ["metadataId"]),
  picklists: defineTable({
    name: v.string(),
    ownerSubject: v.optional(v.string()),
    eventCode: v.optional(v.string()),
    eventTeams: v.optional(v.array(
      v.object({
        teamNumber: v.number(),
        nameShort: v.string(),
        primaryColor: v.optional(v.string()),
        epaMean: v.optional(v.number()),
        rank: v.optional(v.number()),
        city: v.optional(v.string()),
        stateProv: v.optional(v.string()),
        country: v.optional(v.string()),
      })
    )),
    columns: v.optional(v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        teams: v.array(
          v.object({
            teamNumber: v.number(),
            nameShort: v.string(),
            primaryColor: v.optional(v.string()),
            epaMean: v.optional(v.number()),
            rank: v.optional(v.number()),
            city: v.optional(v.string()),
            stateProv: v.optional(v.string()),
            country: v.optional(v.string()),
          })
        ),
      })
    )),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_owner", ["ownerSubject"])
    .index("by_owner_and_updated", ["ownerSubject", "updatedAt"])
    .index("by_event_code", ["eventCode"]),
  allianceSelections: defineTable({
    name: v.string(),
    ownerSubject: v.optional(v.string()),
    eventCode: v.optional(v.string()),
    eventTeams: v.optional(v.array(
      v.object({
        teamNumber: v.number(),
        nameShort: v.string(),
        primaryColor: v.optional(v.string()),
        epaMean: v.optional(v.number()),
        rank: v.optional(v.number()),
        city: v.optional(v.string()),
        stateProv: v.optional(v.string()),
        country: v.optional(v.string()),
      })
    )),
    trackedPicklistIds: v.optional(v.array(v.id("picklists"))),
    alliances: v.optional(v.array(
      v.object({
        id: v.string(),
        captain: v.optional(v.object({
          teamNumber: v.number(),
          nameShort: v.string(),
          primaryColor: v.optional(v.string()),
          epaMean: v.optional(v.number()),
          rank: v.optional(v.number()),
          city: v.optional(v.string()),
          stateProv: v.optional(v.string()),
          country: v.optional(v.string()),
        })),
        firstPick: v.optional(v.object({
          teamNumber: v.number(),
          nameShort: v.string(),
          primaryColor: v.optional(v.string()),
          epaMean: v.optional(v.number()),
          rank: v.optional(v.number()),
          city: v.optional(v.string()),
          stateProv: v.optional(v.string()),
          country: v.optional(v.string()),
        })),
        secondPick: v.optional(v.object({
          teamNumber: v.number(),
          nameShort: v.string(),
          primaryColor: v.optional(v.string()),
          epaMean: v.optional(v.number()),
          rank: v.optional(v.number()),
          city: v.optional(v.string()),
          stateProv: v.optional(v.string()),
          country: v.optional(v.string()),
        })),
        thirdPick: v.optional(v.object({
          teamNumber: v.number(),
          nameShort: v.string(),
          primaryColor: v.optional(v.string()),
          epaMean: v.optional(v.number()),
          rank: v.optional(v.number()),
          city: v.optional(v.string()),
          stateProv: v.optional(v.string()),
          country: v.optional(v.string()),
        })),
      })
    )),
    includeThirdPick: v.optional(v.boolean()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_owner", ["ownerSubject"])
    .index("by_owner_and_updated", ["ownerSubject", "updatedAt"])
    .index("by_event_code", ["eventCode"]),
  annotatedVideo: defineTable({
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
  })
    .index("by_source_key", ["sourceKey"])
    .index("by_updated", ["updatedAt"])
    .index("by_creator_and_updated", ["createdBySubject", "updatedAt"]),
  annotations: defineTable({
    annotatedVideoId: v.id("annotatedVideo"),
    authorSubject: v.string(),
    authorName: v.optional(v.string()),
    text: v.string(),
    startTimeSeconds: v.number(),
    endTimeSeconds: v.optional(v.number()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_annotated_video", ["annotatedVideoId"])
    .index("by_annotated_video_and_start", [
      "annotatedVideoId",
      "startTimeSeconds",
    ]),
  annotationReplies: defineTable({
    annotationId: v.id("annotations"),
    authorSubject: v.string(),
    authorName: v.optional(v.string()),
    text: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_annotation", ["annotationId"]),
})
