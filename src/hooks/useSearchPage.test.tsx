import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { PropsWithChildren } from "react"
import { vi } from "vitest"
import { useSearchPage } from "./useSearchPage"
import { clientService } from "@/service/client"

vi.mock("@/service/admin", () => ({
    clientService: { infoSearch: vi.fn() },
}))

describe("useSearchPage", () => {
    const setup = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        })
        const wrapper = ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        )
        const hook = renderHook(() => useSearchPage(), { wrapper })
        return { ...hook, queryClient }
    }

    beforeEach(() => vi.clearAllMocks())

    it("does not search while the input is blank or whitespace-only", async () => {
        const { result, queryClient } = setup()

        act(() => result.current.setSearch("   "))

        await waitFor(() => expect(result.current.debouncedSearch).toBe("   "), { timeout: 1000 })
        expect(clientService.infoSearch).not.toHaveBeenCalled()
        queryClient.clear()
    })

    it("searches using the debounced input and exposes the results", async () => {
        const results = [{ id: 11, firstName: "Ana", lastName: "Silva", createdAt: "2026-01-10" }]
        vi.mocked(clientService.infoSearch).mockResolvedValue(results)
        const { result, queryClient } = setup()

        act(() => result.current.setSearch("Ana Silva"))

        await waitFor(() => expect(clientService.infoSearch).toHaveBeenCalledWith("Ana Silva"), {
            timeout: 1500,
        })
        await waitFor(() => expect(result.current.results).toEqual(results))
        expect(result.current.isError).toBe(false)
        queryClient.clear()
    })
})
