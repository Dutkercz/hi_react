import type { UseFormReturn } from "react-hook-form"

export type LoginResponse = {
    token: string
}

export type LoginResquest = {
    username: string,
    password: string
}

export type AuthContextType = {
    isLogginIn: boolean
    login: (data: LoginResquest) => void
    logout: () => void
    form : UseFormReturn<LoginResquest>
}