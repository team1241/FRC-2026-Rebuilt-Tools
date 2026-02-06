import { timeStamp } from 'console';
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { writeMetadata } from "./metadata";
import { createCycle } from "./cycles";
import { getFormattedTimestamp } from './utils';


export const saveData = mutation({
  args: {
    metadata: v.object({
      userName: v.string(),
      eventCode: v.string(),
      matchNumber: v.string(),
      teamNumber: v.number(),
      videoUrl: v.string(),
      bps: v.number()
    }),
    cycles: v.array(
      v.object({
        cycleNumber: v.number(),
        startTimestamp: v.number(),
        endTimestamp: v.number(),
        numberOfBalls: v.number(),
        bps: v.number(),
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
