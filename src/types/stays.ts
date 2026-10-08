import type { Payment } from "./payment"

export type RefundPayment = {
    amount: number
}

export type StayRequest = {
    clientId: number
    roomId: number
    checkIn: string
    checkOut: string
    totalGuests: number
    isPaid: boolean
    payment?: Payment
    stayGuests: StayGuest[]
}

export type StayGuest = {
    name: string
}

export type MonthlyOccupation = {
    roomNumber: string
    checkIn: string
    checkOut: string
    clientName: string
}