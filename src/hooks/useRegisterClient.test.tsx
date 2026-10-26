import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { PropsWithChildren } from "react"
import { MemoryRouter } from "react-router-dom"
import { vi } from "vitest"
import { cepService } from "@/service/cep"
import { clientService } from "@/service/client"
import { toast } from "sonner"
import { useRegisterClient } from "./useRegisterClient"

vi.mock("@/service/cep", () => ({
    cepService: { findCep: vi.fn() },
}))

vi.mock("@/service/client", () => ({
    clientService: { createNewClient: vi.fn() },
}))

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

describe("useRegisterClient", () => {
    const setup = (index = 0) => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        })
        const wrapper = ({ children }: PropsWithChildren) => (
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </MemoryRouter>
        )
        const hook = renderHook(() => useRegisterClient({ index }), { wrapper })
        return { ...hook, queryClient }
    }

    beforeEach(() => vi.clearAllMocks())

    it("starts with the client registration defaults", () => {
        const { result, queryClient } = setup()

        expect(result.current.form.getValues()).toEqual({
            firstName: "",
            lastName: "",
            cpf: "",
            cnpj: "",
            phoneNumber: "",
            addresses: [{ zipCode: "", street: "", number: "", city: "", state: "" }],
        })
        queryClient.clear()
    })

    it("does not search for an empty postal code", () => {
        const { result, queryClient } = setup()

        act(() => result.current.handleFindCep())

        expect(cepService.findCep).not.toHaveBeenCalled()
        queryClient.clear()
    })

    it("looks up the selected address postal code and fills its address fields", async () => {
        vi.mocked(cepService.findCep).mockResolvedValue({
            zipCode: "12345-678",
            street: "Rua das Flores",
            city: "Recife",
            state: "PE",
        })
        const { result, queryClient } = setup(1)
        act(() => {
            result.current.form.setValue("addresses", [
                { zipCode: "", street: "", number: "", city: "", state: "" },
                { zipCode: "12345-678", street: "", number: "10", city: "", state: "" },
            ])
        })

        act(() => result.current.handleFindCep())

        await waitFor(() => {
            expect(cepService.findCep).toHaveBeenCalledWith("12345-678")
            expect(result.current.form.getValues("addresses.1")).toEqual({
                zipCode: "12345-678",
                street: "Rua das Flores",
                number: "10",
                city: "Recife",
                state: "PE",
            })
        })
        queryClient.clear()
    })

    it("registers a valid client, resets the form, and returns to the home page", async () => {
        vi.mocked(clientService.createNewClient).mockResolvedValue({})
        const { result, queryClient } = setup()
        const client = {
            firstName: "Ana",
            lastName: "Silva",
            cpf: "123.456.789-00",
            cnpj: "",
            phoneNumber: "(81) 99999-9999",
            addresses: [{
                zipCode: "12345-678",
                street: "Rua das Flores",
                number: "10",
                city: "Recife",
                state: "PE",
            }],
        }

        act(() => {
            result.current.form.setValue("firstName", client.firstName)
            result.current.form.setValue("lastName", client.lastName)
            result.current.form.setValue("cpf", client.cpf)
            result.current.form.setValue("cnpj", client.cnpj)
            result.current.form.setValue("phoneNumber", client.phoneNumber)
            result.current.form.setValue("addresses", client.addresses)
        })
        await act(async () => {
            await result.current.form.handleSubmit(result.current.onSubmit)()
        })

        await waitFor(() => expect(clientService.createNewClient).toHaveBeenCalledWith({
            ...client,
            cpf: "12345678900",
            phoneNumber: "81999999999",
        }))
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Cliente cadastrado com sucesso!"))
        expect(result.current.form.getValues("firstName")).toBe("")
        queryClient.clear()
    })
})
