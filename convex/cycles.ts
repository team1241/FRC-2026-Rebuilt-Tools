import { mutation, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { getFormattedTimestamp } from "./utils";
import { Doc } from "./_generated/dataModel";

export type CreateCyclePayload = Pick<Doc<'cycles'>, 'metadataId' | 'cycleNumber' | 'startTimestamp' | 'endTimestamp' | 'numberOfBalls' | 'cycleType'>

export const createCycles = mutation({
  args: {
    cycles: v.array(
      v.object({
        metadataId: v.id('metadata'),
        cycleNumber: v.number(),
        startTimestamp: v.number(),
        endTimestamp: v.number(),
        numberOfBalls: v.number(),
        cycleType: v.union(v.literal('feeding'), v.literal('shooting')),
      })
    )
  },
  handler: async (ctx, args) => {
    const { cycles } = args;
    const timestamp = getFormattedTimestamp();

    // Inserting in a loop works for convex since it queues all db insertions
    for (const cycle of cycles) {
      createCycle(ctx, cycle, timestamp)
    }
  }
})

export const createCycle = async (ctx: MutationCtx, cycle: CreateCyclePayload, timestamp?: string) => {
  const _timestamp = timestamp ?? getFormattedTimestamp()
  await ctx.db.insert('cycles', { ...cycle, createdAt: _timestamp, updatedAt: _timestamp })
}
