import { axiosService } from "@/lib/axios"
import type { StayGuest } from "./room"

export const stayService = {
    newStay: async (data: StayRequest) => {
        const response = await axiosService.post("/stays", data)
        return response.data
    },
    
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