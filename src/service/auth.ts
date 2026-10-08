import { axiosService } from "./axiosService"
import type { LoginResponse, LoginResquest } from "@/types/auth"

export const authService = {
    login: async (data : LoginResquest) => {
        const response = await axiosService.post<LoginResponse>("/auth", data)
        return response.data
    }
}