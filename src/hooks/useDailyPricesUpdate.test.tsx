import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { PropsWithChildren } from "react"
import { vi } from "vitest"
import { adminService } from "@/service/admin"
import { useDailyPricesUpdate } from "./useDailyPricesUpdate"

vi.mock("@/service/admin", () => ({
    adminService: {
        getDailyPrices: vi.fn(),
        updateDailyPrices: vi.fn(),
    },
}))

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

describe("useDailyPricesUpdate", () => {
    it("sends submitted prices converted from cents to BRL", async () => {
        vi.mocked(adminService.getDailyPrices).mockResolvedValue({
            id: 1,
            oneGuestPrice: 125.5,
            twoGuestPrice: 200,
            threeGuestPrice: 0,
            fourGuestPrice: 350.25,
        })
        vi.mocked(adminService.updateDailyPrices).mockResolvedValue({})

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        })
        const wrapper = ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        )
        const { result } = renderHook(() => useDailyPricesUpdate(), { wrapper })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        act(() => {
            result.current.onSubmit({
                id: 1,
                oneGuestPrice: 12550,
                twoGuestPrice: 20000,
                threeGuestPrice: 0,
                fourGuestPrice: 35025,
            })
        })

        await waitFor(() => {
            expect(adminService.updateDailyPrices).toHaveBeenCalledWith({
                id: 1,
                oneGuestPrice: 125.5,
                twoGuestPrice: 200,
                threeGuestPrice: 0,
                fourGuestPrice: 350.25,
            })
        })

        queryClient.clear()
    })
})
