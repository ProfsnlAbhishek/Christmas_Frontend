import {z} from "zod";
export const LotterySchema = z.object({
    ticketID: z.string(),
    packetID: z.number(),
    sold_by: z.string().nullable(),
    purchased_by: z.string().nullable(),
})

export type LotteryFormValues  = z.infer<typeof LotterySchema>;