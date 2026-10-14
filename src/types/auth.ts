import type { UseFormReturn } from "react-hook-form"

export type LoginResponse = {
    token: string
}

export type LoginResquest = {
    username: string,
    password: string
}

export type AuthContextType = {
    isLoading: boolean
    login: (data: LoginResquest) => void
    logout: () => void
    form: UseFormReturn<LoginResquest>
    isLogged: boolean
}