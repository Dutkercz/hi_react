import { axiosService } from "@/lib/axios"
import type { ClientResponse } from "./client"

export const roomService = {
    getAll: async (): Promise<RoomResponse[]> => {
        const response = await axiosService.get("/rooms")
        return response.data
    },
    addDaily: async (id: number) => {
        const response = await axiosService.put(`/rooms/add-daily/${id}`)
        return response.data
    }
}

export type RoomResponse = {
    id: number
    roomNumber: string | null
    singleBeds: number
    doubleBeds: number
    status: RoomStatus
    stay: StayResponse | null
}

export type RoomStatus = "OCCUPIED" | "AVAILABLE" | "MAINTENANCE" | "RESERVED"

export type StayResponse = {
    id: number
    client: ClientSummary | null
    room: RoomSummary | null
    checkIn: string
    checkOut: string
    dailyPrice: number
    paidPrice: number
    totalPrice: number 
    stayStatus: 'CURRENT' | 'CANCELED' | 'FINISHED'
}

export type ClientSummary = Pick<ClientResponse, "id" | "firstName" | "lastName">

export type RoomSummary = {
    id: number
    roomNumber: string | null
}

export type StayGuest = {
    name: string
}