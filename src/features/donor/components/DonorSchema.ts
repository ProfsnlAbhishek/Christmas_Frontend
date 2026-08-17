import {z} from "zod";

export const DonorSchema = z.object({
    donorID: z.number(),
    donor_name: z.string().min(1, "Donor name is required"),
    address1: z.string().optional(),
    address2: z.string().nullable().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    pick_date: z.string(),
    pick_assigned_to: z.string().optional(),
    pick_det: z.string().optional().nullable(),
    kids_tag: z.number().optional(),
    age0_11: z.number().optional(),
    age12abv: z.number().optional(),
    gift_tag: z.number().optional(),
    inf_boy: z.number().optional(),
    inf_girl: z.number().optional(),
    tod_boy: z.number().optional(),
    tod_girl: z.number().optional(),
    age6_10b: z.number().optional(),
    age6_10g: z.number().optional(),
    age11_14b: z.number().optional(),
    age11_14g: z.number().optional(),
    age15_18b: z.number().optional(),
    age15_18g: z.number().optional(),
    toy_dr: z.boolean().default(false).optional(),
    instruction: z.string().nullable().optional(),
    active: z.boolean().default(true).optional(),
})

export type DonorFormValues = z.infer<typeof DonorSchema>;