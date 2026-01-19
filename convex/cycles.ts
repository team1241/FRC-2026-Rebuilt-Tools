import { formatISO } from "date-fns";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createCycles = mutation({
  args: {
    cycles: v.array(
      v.object({
        metadataId: v.id('metadata'),
        cycleNumber: v.number(),
        startTimestamp: v.string(),
        endTimestamp: v.string(),
        numberOfBalls: v.number(),
        cycleType: v.union(v.literal('feeding'), v.literal('shooting')),
      })
    )
  },
  handler: async (ctx, args) => {
    const { cycles } = args;
    const timestamp = formatISO(new Date());

    // Inserting in a loop works for convex since it queues all db insertions
    for (const cycle of cycles) {
      await ctx.db.insert('cycles', { ...cycle, createdAt: timestamp, updatedAt: timestamp })
    }
  }
})