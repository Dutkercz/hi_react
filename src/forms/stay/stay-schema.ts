import z, { array } from 'zod'
export const staySchema = z.object({
    clientId: z
        .number()
        .nonoptional(),
    roomId: z
        .number()
        .nonoptional(),
    totalGuests: z
        .number("A campo deve receber um número de 1 a 4")
        .min(1, "Não é possível registrar menos que 1 hospede em uma diária")
        .max(4, "Não é possível registrar mais que 4 hopedes em uma diária")
        .nonoptional(),
    stayGuests: array(
        z.object({ name: z.string() })),
    isPaid: z.boolean(),
    checkIn: z
        .string()
        .nonempty({ message: 'O campo data de checkin não pode estar em branco.' })
        .refine(
            (dateString) => {
                const checkIn = new Date(dateString);
                const now = new Date();

                const maxHourCheckout = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0)
                const currentHotelDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

                if (now < maxHourCheckout) {
                    currentHotelDate.setDate(currentHotelDate.getDate() - 1);
                }
                return checkIn >= currentHotelDate;
            },
            { message: 'A data de checkin deve ser maior ou igual à data atual.' }
        ),
    checkOut: z
        .string()
        .nonempty({ message: 'O campo data não pode estar em branco.' })
        .transform((inputDate) => {
            const date = new Date(inputDate)
            date.setHours(8, 55, 0) //o ISOString de baixo vai bota o horario no GMT 0, colocando 8:55 aqui vai dar 11:55 BR
            return date.toISOString().slice(0,16)
        } )
})

export type StaySchema = z.infer<typeof staySchema>