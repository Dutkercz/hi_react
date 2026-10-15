import type { LoginResponse } from "@/types/auth"
import axios, { type InternalAxiosRequestConfig } from "axios"

export const ACCESS_TOKEN_KEY = "accessToken"
export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired"

export const axiosService = axios.create({
    baseURL: "https://hi-spring.fly.dev/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

const refreshService = axios.create({
    baseURL: "https://hi-spring.fly.dev/api/v1/auth",
    withCredentials: true
})

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean
}

const isAuthenticationRequest = (url?: string) => {
    const normalizedUrl = url?.split("?")[0].replace(/\/+$/, "")
    return normalizedUrl === "/auth" || normalizedUrl?.endsWith("/auth/refresh-token") === true
}

let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async () => {
    const response = await refreshService.post<LoginResponse>("/refresh-token", {})
    if (!response.data.token) {
        throw new Error("A renovação da sessão não retornou um token.")
    }
    return response.data.token
}

axiosService.interceptors.request.use((config) => {
    if (!isAuthenticationRequest(config.url)) {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY)
        if (token) {
            config.headers.set("Authorization", `Bearer ${token}`)
        }
    }

    return config
})

axiosService.interceptors.response.use((response) => response, async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
        return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined
    if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isAuthenticationRequest(originalRequest.url)
    ) {
        return Promise.reject(error)
    }

    const tokenAtRequestFailure = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (!tokenAtRequestFailure) {
        return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
        if (!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {
                refreshPromise = null
            })
        }

        const newAccessToken = await refreshPromise
        const activeToken = localStorage.getItem(ACCESS_TOKEN_KEY)
        if (!activeToken) {
            return Promise.reject(error)
        }

        const tokenToUse = activeToken === tokenAtRequestFailure ? newAccessToken : activeToken
        if (activeToken === tokenAtRequestFailure) {
            localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
        }
        originalRequest.headers.set("Authorization", `Bearer ${tokenToUse}`)
        return axiosService(originalRequest)
    } catch (refreshError) {
        if (localStorage.getItem(ACCESS_TOKEN_KEY) === tokenAtRequestFailure) {
            localStorage.removeItem(ACCESS_TOKEN_KEY)
            window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT))
        }
        return Promise.reject(refreshError)
    }
})
