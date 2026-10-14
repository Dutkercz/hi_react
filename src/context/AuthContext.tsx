import { loginSchema } from "@/schemas/loginSchema";
import { authService } from "@/service/auth";
import type { AuthContextType, LoginResquest } from "@/types/auth";
import type { BackendError } from "@/types/backendError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY, AUTH_SESSION_EXPIRED_EVENT } from "@/service/axiosService";

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: React.ReactElement
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLogged, setIsLogged] = useState(() => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)))
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsLogged(false)
      queryClient.clear()
      navigate("/login", { replace: true })
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [navigate, queryClient])

  const loginMutation = useMutation({
    mutationFn: (data: LoginResquest) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.token)
      setIsLogged(true)
      navigate("/")
    },
    onError: (error: AxiosError<BackendError>) => {
      form.reset()
      toast.error("Erro ao realizar login: " + error.response?.data.detail)
    }
  })

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem("refreshToken")
    setIsLogged(false)
    queryClient.clear()
    navigate("/login", { replace: true })
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
      isLoading: loginMutation.isPending,
      logout: handleLogout,
      form: form,
      isLogged: isLogged
    }} >
    {children}
  </AuthContext.Provider>
}

export default AuthContext