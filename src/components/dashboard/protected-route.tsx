import type { ReactNode } from "react"

type ProtectedAdminRouteProps = {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedAdminRouteProps) => {
    /* 
    const isAdmin = true
    
    if(isAdmin){
        return <Navigate to="/"/>
    }
    */

    return <>{children}</>


}