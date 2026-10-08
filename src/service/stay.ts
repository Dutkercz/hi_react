import { axiosService } from "@/service/axiosService"
import type { StayPayment } from "@/types/payment"
import type { MonthlyOccupation, RefundPayment, StayRequest } from "@/types/stays"

export const stayService = {
    newStay: async (data: StayRequest) => {
        const response = await axiosService.post("/stays", data)
        return response.data
    },
    addPaymentAmout: async (id: number, ammout: StayPayment) => {
        const response = await axiosService.patch(`/stays/${id}/add-payment-amount`, ammout)
        return response.data
    },
    updateStay: async (id: number) => {
        const response = await axiosService.patch(`/stays/update-daily-rates/${id}`)
        return response.data
    },
    checkOut: async (id: number) => {
        const response = await axiosService.patch(`/stays/checkout/${id}`)
        return response.data
    },
    monthlyStatusBoard: async (year?: number, month?: number) => {
        const response = await axiosService.get<MonthlyOccupation[]>(`/stays/monthly-occupation?year=${year}&month=${month}`)
        return response.data
    },
    refundAmount: async (id: number, refundAmount: RefundPayment) => {
        const response = await axiosService.patch(`/stays/refund/${id}`, refundAmount)
        return response.data
    },
    addDaily: async (id: number) => {
        const response = await axiosService.put(`/stays/add-daily/${id}`)
        return response.data
    },
}
