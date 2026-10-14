import { useAuth } from "@/hooks/useAuth"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

type ProtectedAdminRouteProps = {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedAdminRouteProps) => {
    const {isLogged} = useAuth()
    
    if(!isLogged){
     return <Navigate to="/login" replace />
 }
 
    return <>{children}</>
}