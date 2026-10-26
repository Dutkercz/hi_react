import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { ChangeEvent, PropsWithChildren } from "react"
import { vi } from "vitest"
import { userService } from "@/service/user"
import type { UserResponse } from "@/types/user"
import { toast } from "sonner"
import { useMyAccountPage } from "./useMyAccountPage"

vi.mock("@/service/user", () => ({
    userService: { getImg: vi.fn(), uploadImage: vi.fn() },
}))

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

describe("useMyAccountPage", () => {
    const user: UserResponse = { fullName: "Ana Silva", email: "ana@example.com", role: "USER" }
    const createObjectURL = vi.fn(() => "blob:preview")
    const revokeObjectURL = vi.fn()

    const setup = (account: UserResponse | null | undefined = user) => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        })
        const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
        const wrapper = ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        )
        const hook = renderHook(() => useMyAccountPage({ user: account ?? undefined }), { wrapper })
        return { ...hook, queryClient, invalidateQueries }
    }

    beforeEach(() => {
        vi.resetAllMocks()
        createObjectURL.mockReturnValue("blob:preview")
        vi.stubGlobal("URL", { createObjectURL, revokeObjectURL })
    })

    afterEach(() => vi.unstubAllGlobals())

    it("loads the current image only when a user is available", async () => {
        vi.mocked(userService.getImg).mockResolvedValue("blob:current")
        const { result, queryClient } = setup()

        await waitFor(() => expect(result.current.displayedImage).toBe("blob:current"))
        expect(userService.getImg).toHaveBeenCalledTimes(1)
        expect(queryClient.getQueryCache().findAll().map((query) => query.queryKey)).toContainEqual([
            "user-img",
            user.email,
        ])
        queryClient.clear()
    })

    it("does not fetch the current image before the user is loaded", () => {
        const { queryClient } = setup(null)

        expect(userService.getImg).not.toHaveBeenCalled()
        queryClient.clear()
    })

    it("previews valid image files, rejects non-image files, and resets the input", () => {
        const { result, queryClient } = setup()
        const image = new File(["image"], "profile.png", { type: "image/png" })
        const input = document.createElement("input")
        input.value = "profile.png"
        Object.defineProperty(input, "files", { configurable: true, value: [image] })

        act(() => result.current.handleImageChange({ target: input } as ChangeEvent<HTMLInputElement>))

        expect(result.current.image).toBe(image)
        expect(result.current.displayedImage).toBe("blob:preview")
        expect(createObjectURL).toHaveBeenCalledWith(image)
        expect(input.value).toBe("")

        const textFile = new File(["not an image"], "notes.txt", { type: "text/plain" })
        Object.defineProperty(input, "files", { configurable: true, value: [textFile] })
        act(() => result.current.handleImageChange({ target: input } as ChangeEvent<HTMLInputElement>))
        expect(result.current.image).toBe(image)
        expect(toast.error).toHaveBeenCalledWith("Selecione um arquivo de imagem.")
        queryClient.clear()
    })

    it("uploads the selected image, invalidates user data, and clears the preview", async () => {
        vi.mocked(userService.getImg).mockResolvedValue("blob:current")
        vi.mocked(userService.uploadImage).mockResolvedValue({})
        const { result, queryClient, invalidateQueries } = setup()
        const image = new File(["image"], "profile.png", { type: "image/png" })
        const input = document.createElement("input")
        Object.defineProperty(input, "files", { configurable: true, value: [image] })
        act(() => result.current.handleImageChange({ target: input } as ChangeEvent<HTMLInputElement>))

        act(() => result.current.uploadMutation.mutate(image))

        await waitFor(() => expect(vi.mocked(userService.uploadImage).mock.calls[0]?.[0]).toBe(image))
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Imagem enviada com sucesso."))
        expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["user"] })
        expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["user-img"] })
        expect(result.current.image).toBeNull()
        expect(result.current.displayedImage).toBe("blob:current")
        await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith("blob:preview"))
        queryClient.clear()
    })

    it("shows an error when image upload fails", async () => {
        vi.mocked(userService.uploadImage).mockRejectedValue(new Error("Upload failed"))
        const { result, queryClient } = setup()
        const image = new File(["image"], "profile.png", { type: "image/png" })

        act(() => result.current.uploadMutation.mutate(image))

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Não foi possível enviar a imagem. Tente novamente.")
        })
        queryClient.clear()
    })
})
