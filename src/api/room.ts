import { axiosService } from "@/lib/axios"
import type { ClientResponse } from "./client"

export const roomService = {
    getAll: async (): Promise<RoomResponse[]> => {
        const response = await axiosService.get("/rooms")
        return response.data
    }
}


export type RoomResponse = {
    id: number
    roomNumber: number
    singleBeds: number
    doubleBeds: number
    status: RoomStatus
    stayActive: StayActiveResponse
}

export type RoomStatus = "OCCUPIED" | "AVAILABLE" | "MAINTENANCE" | "RESERVED"

export type StayActiveResponse = {
    id: number
    client: ClientResponse
    totalGuests: number
    dailyPrice: number
    checkIn: string
    stayGuests: StayGuest[]
}

export type StayGuest = {
    name: string
}