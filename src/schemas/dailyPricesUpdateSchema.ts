import z from 'zod'

const priceInCentsSchema = z.preprocess(
    (value) => {
        if (typeof value === "number") {
            return Math.round(value * 100)
        }

        return typeof value === "string" ? value.replace(/\D/g, "") : value
    },
    z.coerce.number("O valor deve ser um número válido")
)

export const dailyPricesUpdateSchema = z.object({
    id: z.coerce.number(),
    oneGuestPrice: priceInCentsSchema,
    twoGuestPrice: priceInCentsSchema,
    threeGuestPrice: priceInCentsSchema,
    fourGuestPrice: priceInCentsSchema
})

export type DailyPricesUpdateSchema = z.infer<typeof dailyPricesUpdateSchema>