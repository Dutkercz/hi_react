export type MonthlyResume = {
    totalMonthProfit: number
    lastMonthProfit: number,
    percentageChange: number
    actualMonthDailyRates: number,
    lastMonthDailyRates: number,
    percentageActualMonthlyOccupation : number,
    percentageLastMonthlyOccupation : number
}

export type DailyPricesResponse = {
    id: number
    oneGuestPrice: number
    twoGuestPrice: number
    threeGuestPrice: number
    fourGuestPrice: number
}

export type DailyPricesUpdate = {
    id: number
    oneGuestPrice: number
    twoGuestPrice: number
    threeGuestPrice: number
    fourGuestPrice: number
}