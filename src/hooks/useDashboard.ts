import { adminService } from "@/service/admin"
import type { MonthlyResume } from "@/types/admin"
import { useQuery } from "@tanstack/react-query"

export const useDashboard = (year: number, month: number) => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["dashboard-data", year, month],
        queryFn: (): Promise<MonthlyResume> => adminService.monthResume(year, month)
    })

    return { data, isLoading, isError }
}