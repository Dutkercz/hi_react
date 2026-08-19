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
    }
    
}

type StayPayment = {
    amount : number
}

export type StayRequest = {
    clientId : number
    roomId : number
    checkIn: string
    checkOut: string
    totalGuests : number
    isPaid: boolean
    stayGuests : StayGuest[]
}