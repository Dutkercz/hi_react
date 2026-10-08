import { axiosService } from "@/service/axiosService"
import type { DailyPricesResponse, MonthlyResume } from "@/types/admin"

export const adminService = {
    monthResume: async (year: number, month: number) => {
        const response = await axiosService
            .get<MonthlyResume>(`/admin/month-resume?year=${year}&month=${month}`)
        return response.data
    },
    getDailyPrices: async () => {
        const response = await axiosService.get<DailyPricesResponse>("/admin/daily-prices")
        return response.data
    }
}
