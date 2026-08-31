import { axiosService } from "@/lib/axios"

export const adminService = {
    monthResume : async (year: number, month: number) => {
        const response = await axiosService
                .get<MonthlyResume>(`/admin/month-resume?year=${year}&month=${month}`)        
        return response.data
    },
}

export type MonthlyResume = {
    totalMonthProfit : number
}