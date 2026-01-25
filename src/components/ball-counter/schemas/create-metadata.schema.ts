import z from "zod";

export const metadataSchema = z.object({
    userName: z.string().min(1, "Name is required."),
    eventCode: z.string().min(1, "Event code is required."),
    matchNumber: z.string().min(1, "Match number is required."),
    teamNumber: z.string().regex(/^\d+$/, "Team number must be a number."),
});

export type MetadataFormValues = z.infer<typeof metadataSchema>;
