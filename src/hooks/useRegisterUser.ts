import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import type { UserRequest } from "@/types/user"
import { userRequestSchema } from "@/schemas/userRequestSchema"
import { userService } from "@/service/user"
import type { AxiosError } from "axios"
import type { BackendError } from "@/types/backendError"

export const useRegisterUserForm = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const form = useForm<UserRequest>({
        resolver: zodResolver(userRequestSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmpw: ""
        },
        mode: "onTouched"        
    })

    const registerMutation = useMutation({
        mutationFn: (data: UserRequest) => userService.registerUser(data),
        onSuccess: () => {
            toast.success("Usuário cadastrado com sucesso!")
            form.reset()
            queryClient.invalidateQueries({queryKey: ["user"]})
            queryClient.invalidateQueries({queryKey: ["users"]})
            navigate("/")
        },
        onError: (error: AxiosError<BackendError>) => {
            toast.error("Erro ao cadastrar novo usuário: " + error.response?.data.detail)
        }
    })

    const onSubmit = (data: UserRequest) => {
        registerMutation.mutate(data)
    }
    const isLoading = registerMutation.isPending

    return { form, onSubmit, isLoading  }
}