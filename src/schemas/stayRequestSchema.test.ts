import { describe, expect, it } from "vitest"
import { staySchema } from "./stayRequestSchema"

const validStay = {
    clientId: 1,
    roomId: 1,
    checkIn: "2099-01-01T12:00",
    checkOut: "2099-01-02T12:00",
    totalGuests: 1,
    stayGuests: [],
}

describe("staySchema", () => {
    it("allows an unpaid stay without a payment method", () => {
        const result = staySchema.safeParse({
            ...validStay,
            isPaid: false,
        })

        expect(result.success).toBe(true)
    })

    it("requires a payment method for a paid stay", () => {
        const result = staySchema.safeParse({
            ...validStay,
            isPaid: true,
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues).toContainEqual(
                expect.objectContaining({
                    path: ["method"],
                    message: "O campo forma de pagamento é obrigatório.",
                }),
            )
        }
    })
})
