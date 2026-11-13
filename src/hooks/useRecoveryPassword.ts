import { userRecoveryPwSchema } from "@/schemas/userRecoveryPwSchema"
import { userService } from "@/service/user"
import type { BackendError } from "@/types/backendError"
import type { RecoveryPwDto } from "@/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useRecoveryPassword = () => {
    const navigate = useNavigate()
    const form = useForm({
        resolver: zodResolver(userRecoveryPwSchema),
        defaultValues: {
            otpCode: "",
            password: "",
            confirmpw: ""
        }
    })

    const newPasswordMutation = useMutation({
        mutationFn: (redefineDto: RecoveryPwDto) => userService.recoveryPwRedefine(redefineDto),
        onSuccess: () => {
            form.reset()
            navigate("/login", {replace:true})
            toast.success("Senha alterada com sucesso.")
        },
        onError: (erro : AxiosError<BackendError>) => {
            toast.error("Erro ao atualizar senha: " + erro.response?.data.detail)
        }
    })

    const submitNewPassword = (redefineDto: RecoveryPwDto) => {
        newPasswordMutation.mutate(redefineDto)
    }
    const isLoading = newPasswordMutation.isPending

    return {form, submitNewPassword, isLoading}
}