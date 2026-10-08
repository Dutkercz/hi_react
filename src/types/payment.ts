
export type Payment = {
    method: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'
    amount: number
}

export type StayPayment = {
    amount: number
}