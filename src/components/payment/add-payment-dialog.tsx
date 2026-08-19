import { type RoomResponse } from "@/api/room"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { DialogClose, DialogFooter } from "../ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { stayService } from "@/api/stay"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { useRoomCard } from "../room/useRoomCard"
import { useState } from "react"
import InputMask from "@react-input/mask/InputMask"
import { Button } from "../ui/button"
import { CreditCardIcon, WalletCardsIcon } from "lucide-react"

type AddPaymentDialogProps = {
    setOpen: (v: boolean) => void
    room: RoomResponse
}

const AddPaymentDialog = ({ setOpen, room }: AddPaymentDialogProps) => {

    const { formatCurrency } = useRoomCard(room)
    const queryClient = useQueryClient()
    const [amount, setAmount] = useState("")
    const remainingPrice = room.stay?.remainingPrice ?? 0

    const parseAmount = (value: string) => {
        const digits = value.replace(/\D/g, "")
        return Number(digits)
    }

    const addPayMutation = useMutation({
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

    const handleSubmit = () => {
        const paymentAmount = parseAmount(amount)

        if (paymentAmount <= 0) {
            toast.error("Informe um valor válido para o pagamento")
            return
        }

        if (paymentAmount > remainingPrice) {
            toast.error("O pagamento não pode ser maior que o valor a pagar")
            return
        }

        addPayMutation.mutate(paymentAmount)
    }

    return (
        <DialogContent className="gap-5 sm:max-w-md">
            <DialogHeader className="space-y-2 pr-8">
                <div className="flex items-center gap-2 text-primary">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                        <CreditCardIcon className="size-4" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide">Financeiro</span>
                </div>
                <DialogTitle className="text-xl font-semibold">
                    Registrar pagamento
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                    Apartamento {room.roomNumber} · {room.stay?.client?.firstName} {room.stay?.client?.lastName}
                </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Valor já pago</p>
                    <p className="mt-1 font-semibold">{formatCurrency(room.stay?.paidPrice)}</p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <p className="text-xs text-muted-foreground">Saldo restante</p>
                    <p className="mt-1 font-semibold text-primary">{formatCurrency(remainingPrice)}</p>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="payment-amount" className="text-sm font-medium">Valor do pagamento</label>
                <InputMask
                    id="payment-amount"
                    component={Input}
                    value={amount}
                    mask="R$ _____,__"
                    replacement={{ _: /\d/ }}
                    placeholder="R$ 0,00"
                    inputMode="numeric"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Informe o valor em reais, com duas casas decimais.</p>
            </div>

            <DialogFooter className="-mx-4 -mb-4">
                <DialogClose render={<Button type="button" variant="outline" />}>
                    Cancelar
                </DialogClose>
                <Button type="button" onClick={handleSubmit} disabled={addPayMutation.isPending}>
                    <WalletCardsIcon />
                    {addPayMutation.isPending ? "Registrando..." : "Registrar pagamento"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default AddPaymentDialog