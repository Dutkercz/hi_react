import { adminService } from "@/service/admin"
import type { MonthlyResume } from "@/types/admin"
import { useQuery } from "@tanstack/react-query"

export const useDashboard = () => {

    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const lastMonth = new Date().getMonth().toString().padStart(2, "0")

    const { data: monthlyResume, isLoading, isError } = useQuery({
        queryKey: ["dashboard-data", year, month],
        queryFn: (): Promise<MonthlyResume> => adminService.monthResume(year, month)
    })

    const percentageDailyRates = monthlyResume
        ? ((monthlyResume.actualMonthDailyRates - monthlyResume.lastMonthDailyRates) / monthlyResume.lastMonthDailyRates) * 100
        : 0
  
    const monthlyOccupationVariation = monthlyResume
        ? ((monthlyResume.percentageActualMonthlyOccupation - monthlyResume.percentageLastMonthlyOccupation) / monthlyResume.percentageLastMonthlyOccupation) * 100
        : 0


    return { monthlyResume, isLoading, isError, year, month, lastMonth, 
        percentageDailyRates, monthlyOccupationVariation }
}