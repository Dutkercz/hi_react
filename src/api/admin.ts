import { axiosService } from "@/lib/axios"

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

export type MonthlyResume = {
    totalMonthProfit: number
}

export type DailyPricesResponse = {
    oneGuestPrice: number
    twoGuestPrice: number
    threeGuestPrice: number
    fourGuestPrice: number
}