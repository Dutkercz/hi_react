import { AdminNavigation } from "@/components/admin/AdminNavbar"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"

const AdminPage = () => {
    const {isLogged} = useAuth()

    if(!isLogged) return <Navigate to="/login" replace />

    return (
        <Card className="m-1">
            <AdminNavigation />
            <Outlet />
        </Card>
    )
}

export default AdminPage