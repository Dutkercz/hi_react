import type { LoginResponse } from "@/types/auth"
import axios from "axios"
export const axiosService = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

const refreshService = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth",
    withCredentials: true
})

let accessToken = localStorage.getItem("accessToken")
axiosService.interceptors.response.use((r) => r, async (err) => {
    const originalRequest = err.config

    if (err.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
            const resp = await refreshService.post<LoginResponse>("/refresh-token", {}, { withCredentials: true });
            const newAccessToken = resp.data.token
            accessToken = newAccessToken
            localStorage.setItem("accessToken", newAccessToken)
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
            return axiosService(originalRequest)
        } catch (refreshError) {
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(err);
})
