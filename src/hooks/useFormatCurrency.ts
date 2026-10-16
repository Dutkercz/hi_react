export const useFormatCurrency = () => {
    const format = (value: string | number | null | undefined) => {
        if (typeof value === 'string') {
            value = parseFloat(value)
        }
        if (typeof value !== 'number' || isNaN(value)) return '—'
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }
    return format
}