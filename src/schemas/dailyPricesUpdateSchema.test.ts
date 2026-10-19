import { describe, expect, it } from "vitest"
import { dailyPricesUpdateSchema } from "./dailyPricesUpdateSchema"

describe("dailyPricesUpdateSchema", () => {
    it("converts loaded BRL values into cents", () => {
        const result = dailyPricesUpdateSchema.parse({
            id: 1,
            oneGuestPrice: 125.5,
            twoGuestPrice: 200,
            threeGuestPrice: 0,
            fourGuestPrice: 350.25,
        })

        expect(result).toEqual({
            id: 1,
            oneGuestPrice: 12550,
            twoGuestPrice: 20000,
            threeGuestPrice: 0,
            fourGuestPrice: 35025,
        })
    })

    it("converts pt-BR currency input into cents", () => {
        const result = dailyPricesUpdateSchema.parse({
            id: 1,
            oneGuestPrice: "R$ 1.234,56",
            twoGuestPrice: "R$ 200,00",
            threeGuestPrice: "R$ 0,00",
            fourGuestPrice: "R$ 350,25",
        })

        expect(result).toEqual({
            id: 1,
            oneGuestPrice: 123456,
            twoGuestPrice: 20000,
            threeGuestPrice: 0,
            fourGuestPrice: 35025,
        })
    })
})
