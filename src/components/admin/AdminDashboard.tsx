import { ChartArea } from "@/components/admin/ChartArea"
import AdminDashboardCard from "./AdminDashboardCard"

const AdminDashboard = () => {
    return (
        <div>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AdminDashboardCard />
                        <div className="px-4 lg:px-6">
                            <ChartArea />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
