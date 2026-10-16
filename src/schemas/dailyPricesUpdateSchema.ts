import z from 'zod'

export const dailyPricesUpdateSchema = z.object({
    id: z.coerce.number(),
    oneGuestPrice: z.preprocess(
        (val) => typeof val === "string" ? val.replace(/\D/g, "") : val,
        z.coerce.number("O valor deve ser um número válido")),
    twoGuestPrice: z.preprocess(
        (val) => typeof val === "string" ? val.replace(/\D/g, "") : val,
        z.coerce.number("O valor deve ser um número válido")
    ),
    threeGuestPrice: z.preprocess(
        (val) => typeof val === "string" ? val.replace(/\D/g, "") : val,
        z.coerce.number("O valor deve ser um número válido")
    ),
    fourGuestPrice: z.preprocess(
        (val) => typeof val === "string" ? val.replace(/\D/g, "") : val,
        z.coerce.number("O valor deve ser um número válido")
    )
})

export type DailyPricesUpdateSchema = z.infer<typeof dailyPricesUpdateSchema>