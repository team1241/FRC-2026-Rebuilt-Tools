import { timeStamp } from 'console';
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { writeMetadata } from "./metadata";
import { createCycle } from "./cycles";
import { getFormattedTimestamp } from './utils';


export const saveData = mutation({
  args: {
    metadata: v.object({
      eventCode: v.string(),
      matchNumber: v.string(),
      teamNumber: v.number(),
      videoUrl: v.string(),
      userId: v.string(),
    }),
    cycles: v.array(
      v.object({
        cycleNumber: v.number(),
        startTimestamp: v.string(),
        endTimestamp: v.string(),
        numberOfBalls: v.number(),
        cycleType: v.union(v.literal('feeding'), v.literal('shooting')),
      })
    )
  }, handler: async (ctx, args) => {
    const { metadata, cycles } = args
    const timestamp = getFormattedTimestamp()

    const metadataId = await writeMetadata(ctx, metadata, timestamp)

    for (const cycle of cycles) {
      await createCycle(ctx, { ...cycle, metadataId: metadataId }, timestamp)
    }
  }
})