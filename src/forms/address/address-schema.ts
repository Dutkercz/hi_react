import z from "zod";

export const addressCreateSchema = z.object({
    zipCode: z.string().trim(),
    street: z.string().trim(),
    number: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim(),
}
)