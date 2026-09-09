import type { RoomResponse } from "@/api/room";
import { stayService } from "@/api/stay";
import { useFormatCurrency } from "@/hooks/use-formart-currency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UseAddPaymentProps = {
    room : RoomResponse,
    setOpen : (v : boolean) => void
}

export const useAddPayment = ({room, setOpen} : UseAddPaymentProps) => {

    const  formatCurrency  = useFormatCurrency()
    const queryClient = useQueryClient()
    const remainingPrice = room.stay?.remainingPrice ?? 0

    const parseAmount = (value: string) => {
        console.log(value);

        const digits = value.replace(/\D/g, "")
        console.log(digits);

        return Number(digits) / 100
    }

    const {mutate,  isPending} = useMutation({
        mutationFn: (data: number) => {
            const stayId = room.stay?.id ?? 0
            return stayService.addPaymentAmout(stayId, { amount: data })
        },
        onSuccess: () => {
            toast.success("Pagamento registrado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["rooms"] })
            setOpen(false)
        },
        onError: () => {
            toast.error("Erro ao adicionar pagamento")
            setOpen(false)
        }
    })

    const handleSubmit = (amount : string) => {
        const paymentAmount = parseAmount(amount)

        if (paymentAmount <= 0) {
            toast.error("Informe um valor válido para o pagamento")
            return
        }

        if (paymentAmount > remainingPrice) {
            toast.error("O pagamento não pode ser maior que o valor a pagar")
            return
        }

        mutate(paymentAmount)
    }

    return {handleSubmit, formatCurrency, remainingPrice, isPending}
}