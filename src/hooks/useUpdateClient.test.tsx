import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { PropsWithChildren } from "react"
import { vi } from "vitest"
import { clientService } from "@/service/client"
import type { ClientResponse } from "@/types/client"
import { toast } from "sonner"
import { useUpdateClient } from "./useUpdateClient"

vi.mock("@/service/client", () => ({
    clientService: { updateClient: vi.fn() },
}))

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

describe("useUpdateClient", () => {
    const client: ClientResponse = {
        id: 7,
        firstName: "Ana",
        lastName: "Silva",
        createdAt: "2026-01-10",
    }

    const setup = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        })
        const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
        const wrapper = ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        )
        const hook = renderHook(() => useUpdateClient(client), { wrapper })
        return { ...hook, queryClient, invalidateQueries }
    }

    beforeEach(() => vi.clearAllMocks())

    it("initializes the update form from the selected client", () => {
        const { result, queryClient } = setup()

        expect(result.current.form.formState.defaultValues).toMatchObject({
            id: 7,
            firstName: "Ana",
            lastName: "Silva",
        })
        queryClient.clear()
    })

    it("updates the client and invalidates the client list on success", async () => {
        vi.mocked(clientService.updateClient).mockResolvedValue({})
        const { result, queryClient, invalidateQueries } = setup()
        const updatedClient = {
            id: 7,
            firstName: "Ana Maria",
            lastName: "Silva",
            phoneNumber: "81999999999",
        }

        act(() => result.current.submit(updatedClient))

        await waitFor(() => expect(clientService.updateClient).toHaveBeenCalledWith(updatedClient))
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Cliente atualizado com sucesso!"))
        expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["clients"] })
        queryClient.clear()
    })
})
