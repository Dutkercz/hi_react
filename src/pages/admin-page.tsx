import { AdminNavigation } from "@/components/admin/admin-nav"
import { Card } from "@/components/ui/card"
import { Outlet } from "react-router-dom"


const AdminPage = () => {
  

    return (
        <Card className="m-1">
            <AdminNavigation />
            <Outlet/>  
        </Card>
    )
}

export default AdminPage