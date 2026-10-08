import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { PropsWithChildren } from "react"
import { vi } from "vitest"
import { clientService } from "@/service/client"
import { useStayRequest } from "./useStayRequest"

vi.mock("@/service/client", () => ({
    clientService: { findByCpf: vi.fn() },
}))

describe("useStayRequest", () => {
    it("clears the selected client when the CPF changes", async () => {
        vi.mocked(clientService.findByCpf).mockResolvedValue({
            id: 12,
            firstName: "Ana",
            lastName: "Silva",
        })

        const queryClient = new QueryClient()
        const wrapper = ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        )
        const { result } = renderHook(() => useStayRequest(5, vi.fn()), { wrapper })

        act(() => {
            result.current.form.register("clientId")
            result.current.handleCpfChange("111.111.111-11")
        })
        act(() => {
            result.current.handleCpfSearch()
        })

        await waitFor(() => expect(result.current.clientName).toBe("Ana Silva"))
        expect(result.current.form.getValues("clientId")).toBe(12)

        act(() => result.current.handleCpfChange("222.222.222-22"))

        expect(result.current.form.getValues("clientId")).toBeUndefined()
        expect(result.current.clientName).toBe("")
        queryClient.clear()
    })
})