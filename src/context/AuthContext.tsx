import { loginSchema } from "@/schemas/loginSchema";
import { authService } from "@/service/auth";
import type { AuthContextType, LoginResquest } from "@/types/auth";
import type { BackendError } from "@/types/backendError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
    children: React.ReactElement
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigation = useNavigate()

    const loginMutation = useMutation({
        mutationFn: (data: LoginResquest) => authService.login(data),
        onSuccess: (data) => {
            localStorage.setItem("accessToken", data.token)
            navigation("/")
        },
        onError: (error: AxiosError<BackendError>) => {
            toast.error("Erro ao realizar login: " + error.response?.data.detail)
        }
    })

    const handleLogout = () => {
        localStorage.clear()
    }

    const form = useForm<LoginResquest>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        },
        shouldUnregister: true
    })

    return <AuthContext.Provider
        value={{
            login: loginMutation.mutate,
            isLogginIn: loginMutation.isPending,
            logout: handleLogout,
            form: form
        }} >
        {children}
    </AuthContext.Provider>
}

export default AuthContext