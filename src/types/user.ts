export type UserResponse = {
    fullName: string
    email: string
    role: UserRole
}

export type UserRequest = {
    email: string
    password: string
    confirmpw: string
    fullName: string
}

export type UserProviderType = {
    user: UserResponse | undefined
    isLoading: boolean
}

export type UserRole = "ADMIN" | "USER"