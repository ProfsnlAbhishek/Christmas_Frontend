import {z} from "zod";


export const DonorContactSchema = z.object({
    contactID: z.number(),
    contact_name: z.string().min(1, "Contact Name is required"),
    contact_phone: z.string().optional(),
     email: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.email("Invalid email address").optional()
  ),
    alternate_phone: z.string().optional(),
    fax: z.string().optional(),
})


export type DonorContactFormValues = z.infer<typeof DonorContactSchema>;