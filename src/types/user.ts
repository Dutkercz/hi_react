export type UserResponse = {
    name: string
    email: string
    role: UserRole
}

export type UserRole = "ADMIN" | "USER"