import {z} from "zod";

export const ChildSchema = z.object({
    childID : z.number(),
    f_name : z.string().min(1,"Child first name is required"),
    l_name : z.string().min(1,"Child last name is required"),
    age : z.number().optional().nullable(),
    sacwisID: z.number().min(1, "Sacwis ID is required"),
    gender: z.string().min(1, "Gender is required"),
    race: z.string().optional(),
    clothing_type: z.number().optional().nullable(),
    size: z.string().optional(),
    shoe_size: z.string().optional().nullable(),
    gift_card: z.string().optional().nullable(),
    workerID: z.number().min(1, "Worker is required"),
    donorID: z.number().optional().nullable(),
    suggestion : z.string().optional(),



})

export type ChildFormValues = z.infer<typeof ChildSchema>;