import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { PropsWithChildren } from "react"
import { vi } from "vitest"
import { stayService } from "@/service/stay"
import type { RoomResponse } from "@/types/room"
import { toast } from "sonner"
import { useAddPayment } from "./useAddPayment"

vi.mock("@/service/stay", () => ({
    stayService: { addPaymentAmout: vi.fn() },
}))

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

describe("useAddPayment", () => {
    const room: RoomResponse = {
        id: 1,
        status: "OCCUPIED",
        roomNumber: "1",
        singleBeds: 2,
        doubleBeds: 1,
        stay: {
            id: 15,
            client: { id: 8, firstName: "Ana", lastName: "Silva" },
            room: { id: 1, roomNumber: "1" },
            checkIn: "2026-09-05T13:00:00",
            checkOut: "2026-09-08T09:00:00",
            dailyRates: 3,
            dailyPrice: 150,
            paidPrice: 400,
            remainingPrice: 50,
            totalPrice: 450,
            isPaid: false,
            stayStatus: "CURRENT",
        },
    }

    const setup = () => {
        const queryClient = new QueryClient({
            defaultOptions: { mutations: { retry: false } },
        })
        const setOpen = vi.fn()
        const wrapper = ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        )
        const hook = renderHook(() => useAddPayment({ room, setOpen }), { wrapper })
        return { ...hook, queryClient, setOpen }
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("rejects an amount higher than the remaining balance", () => {
        const { result } = setup()

        act(() => result.current.handleSubmit("R$ 50,01"))

        expect(stayService.addPaymentAmout).not.toHaveBeenCalled()
        expect(toast.error).toHaveBeenCalledWith("O pagamento não pode ser maior que o valor a pagar")
    })

    it("sends the parsed amount and closes after success", async () => {
        vi.mocked(stayService.addPaymentAmout).mockResolvedValue({})
        const { result, setOpen, queryClient } = setup()

        act(() => result.current.handleSubmit("R$ 25,00"))

        await waitFor(() => expect(stayService.addPaymentAmout).toHaveBeenCalledWith(15, { amount: 25 }))
        await waitFor(() => expect(setOpen).toHaveBeenCalledWith(false))
        expect(toast.success).toHaveBeenCalledWith("Pagamento registrado com sucesso!")
        queryClient.clear()
    })

    it("keeps the dialog open when the API rejects the payment", async () => {
        vi.mocked(stayService.addPaymentAmout).mockRejectedValue(new Error("Falha na API"))
        const { result, setOpen, queryClient } = setup()

        act(() => result.current.handleSubmit("R$ 25,00"))

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Erro ao adicionar pagamento"))
        expect(setOpen).not.toHaveBeenCalled()
        queryClient.clear()
    })
})