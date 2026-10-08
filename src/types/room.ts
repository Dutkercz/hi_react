import type { ClientSummary } from "./client"

export type RoomUpdateRequest = {
    singleBeds: number
    doubleBeds: number
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
    dailyRates: number
    dailyPrice: number
    paidPrice: number
    remainingPrice: number
    totalPrice: number
    isPaid: boolean
    stayStatus: 'CURRENT' | 'CANCELED' | 'FINISHED'
}


export type RoomSummary = {
    id: number
    roomNumber: string | null
}
