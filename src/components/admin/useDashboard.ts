import { adminService } from "@/api/admin"
import { useQuery } from "@tanstack/react-query"

export const useDashboard = (year: number, month: number) => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["dashboard-data", year, month],
        queryFn: () => adminService.monthResume(year, month)
    })

    return { data, isLoading, isError }
}