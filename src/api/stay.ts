import { axiosService } from "@/lib/axios"
import type { StayGuest } from "./room"

export const stayService = {
    newStay: async (data: StayRequest) => {
        const response = await axiosService.post("/stays", data)
        return response.data
    },
    addPaymentAmout : async (id : number, ammout : StayPayment) => {
        const response = await axiosService.patch(`/stays/${id}/add-payment-amount`, ammout)
        return response.data
    },
    updateStay : async (id : number) => {
        const response = await axiosService.patch(`/stays/update-daily-rates/${id}`)
        return response.data
    },
    checkOut: async (id : number) => {
        const response = await axiosService.patch(`/stays/checkout/${id}`)
        return response.data
    },
    monthlyStatusBoard: async (year? : number, month?: number ) => {
        const response = await axiosService.get<MonthlyOccupation[]>(`/stays/monthly-occupation?year=${year}&month=${month}`)
        return response.data
    },
    refundAmount: async (id : number, refundAmount: RefundPayment ) => {
        const response = await axiosService.patch(`/stays/refund/${id}`, refundAmount)
        return response.data
    }
}

type StayPayment = {
    amount : number
}

export type RefundPayment = {
    amount : number
}

export type StayRequest = {
    clientId : number
    roomId : number
    checkIn: string
    checkOut: string
    totalGuests : number
    isPaid: boolean
    payment? : Payment
    stayGuests : StayGuest[]
}

export type Payment = {
    method: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'
    amount: number
}

export type MonthlyOccupation = {
    roomNumber : string
    checkIn : string
    checkOut : string
    clientName : string
}