import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { BaseSyntheticEvent, PropsWithChildren } from "react"
import { vi } from "vitest"
import { roomService } from "@/service/room"
import { stayService } from "@/service/stay"
import type { MonthlyOccupation } from "@/types/stays"
import { useOccupationPage } from "./useOccupationPage"

vi.mock("@/service/room", () => ({
    roomService: { getAll: vi.fn() },
}))

vi.mock("@/service/stay", () => ({
    stayService: { monthlyStatusBoard: vi.fn() },
}))

describe("useOccupationPage", () => {
    const setup = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        })
        const wrapper = ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        )
        const hook = renderHook(() => useOccupationPage(), { wrapper })
        return { ...hook, queryClient }
    }

    beforeEach(() => vi.clearAllMocks())

    it("loads rooms and the selected month occupation", async () => {
        vi.mocked(roomService.getAll).mockResolvedValue([])
        vi.mocked(stayService.monthlyStatusBoard).mockResolvedValue([])
        const { result, queryClient } = setup()
        const now = new Date()

        await waitFor(() => {
            expect(roomService.getAll).toHaveBeenCalled()
            expect(stayService.monthlyStatusBoard).toHaveBeenCalledWith(now.getFullYear(), now.getMonth() + 1)
        })
        expect(result.current.days).toHaveLength(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate())
        queryClient.clear()
    })

    it("marks occupied days within the selected month and excludes checkout day", async () => {
        const stays: MonthlyOccupation[] = [
            {
                roomNumber: "12",
                checkIn: "2026-05-30T15:00:00",
                checkOut: "2026-06-03T11:00:00",
                clientName: "Ana Silva",
            },
            {
                roomNumber: "13",
                checkIn: "2026-04-20T15:00:00",
                checkOut: "2026-05-01T11:00:00",
                clientName: "João Souza",
            },
        ]
        vi.mocked(roomService.getAll).mockResolvedValue([])
        vi.mocked(stayService.monthlyStatusBoard).mockImplementation(async (year, month) =>
            year === 2026 && month === 5 ? stays : [],
        )
        const { result, queryClient } = setup()

        const changeEvent: BaseSyntheticEvent = {
            nativeEvent: new Event("change"),
            currentTarget: null,
            target: { value: "2026-05" },
            bubbles: false,
            cancelable: false,
            defaultPrevented: false,
            eventPhase: 0,
            isTrusted: false,
            preventDefault: vi.fn(),
            isDefaultPrevented: () => false,
            stopPropagation: vi.fn(),
            isPropagationStopped: () => false,
            persist: vi.fn(),
            timeStamp: Date.now(),
            type: "change",
        }
        act(() => result.current.handleChangeDate(changeEvent))

        await waitFor(() => expect(stayService.monthlyStatusBoard).toHaveBeenCalledWith(2026, 5))
        await waitFor(() => {
            expect(result.current.occupiedDaysByRoom.get("12")).toEqual(new Set([30, 31]))
            expect(result.current.clientNamesByRoomAndDay.get("12")?.get(31)).toBe("Ana Silva")
            expect(result.current.occupiedDaysByRoom.has("13")).toBe(false)
        })
        expect(result.current.selectedYear).toBe(2026)
        expect(result.current.selectedMonth).toBe(5)
        expect(result.current.days).toHaveLength(31)
        queryClient.clear()
    })
})
