import z from 'zod'

export const dailyPricesUpdateSchema = z.object({
    id: z.coerce.number(),
    oneGuestPrice: z.coerce.number(),
    twoGuestPrice: z.coerce.number(),
    threeGuestPrice: z.coerce.number(),
    fourGuestPrice: z.coerce.number()
})

export type DailyPricesUpdateSchema = z.infer<typeof dailyPricesUpdateSchema>