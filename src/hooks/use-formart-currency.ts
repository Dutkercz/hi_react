
export const useFormatCurrency = () => {
    const format = (value: number | null | undefined) => {
        if (typeof value !== 'number') return '—'
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }
    return format
}