import { type RoomResponse } from "@/api/room"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { DialogClose, DialogFooter } from "../ui/dialog"
import { Input } from "../ui/input"
import { useState } from "react"
import { InputNumberFormat } from '@react-input/number-format'
import { Button } from "../ui/button"
import { CreditCardIcon, WalletCardsIcon } from "lucide-react"
import { useAddPayment } from "./useAddPayment"

type AddPaymentDialogProps = {
    setOpen: (v: boolean) => void
    room: RoomResponse
}

const AddPaymentDialog = ({ setOpen, room }: AddPaymentDialogProps) => {

    const [amount, setAmount] = useState("")
    const {handleSubmit, formatCurrency, remainingPrice, isPending} = useAddPayment({room, setOpen})
    
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
                <InputNumberFormat
                    id="payment-amount"
                    component={Input}
                    value={amount}
                    locales="pt-BR"
                    format="currency"
                    currency="BRL"
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                    autoComplete="off"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Informe o valor em reais, com até duas casas decimais.</p>
            </div>

            <DialogFooter className="-mx-4 -mb-4">
                <DialogClose render={<Button type="button" variant="outline" />}>
                    Cancelar
                </DialogClose>
                <Button type="button" onClick={() => handleSubmit(amount)} disabled={isPending}>
                    <WalletCardsIcon />
                    {isPending ? "Registrando..." : "Registrar pagamento"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default AddPaymentDialog