import type { RoomStatus } from '@/api/room'
import { Button } from '../ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Controller, useFieldArray } from "react-hook-form"
import { Input } from '../ui/input'
import { useStayRequestForm } from '@/forms/stay/stay-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService, type ClientResponse } from '@/api/client'
import InputMask from '@react-input/mask/InputMask'
import { stayService, type StayRequest } from '@/api/stay'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'

type ManageRoomProps = {
    setOpen: (v: boolean) => void
    manageType: RoomStatus
    roomId: number
}

const ManageRoom = ({ setOpen, manageType, roomId }: ManageRoomProps) => {

    const [cpfValue, setCpfValue] = useState("")
    const [clientName, setClientName] = useState("")
    const handleClose = () => {
        setClientName("")
        form.reset()
        setOpen(false)
    }
    const form = useStayRequestForm(roomId)
    const queryClient = useQueryClient()

    const { mutate: cpfFindMutation, isPending: cpfPending, isError: cpfError, reset: cpfReset } = useMutation({
        mutationKey: ["client"],
        mutationFn: (cpf: string) => clientService.findByCpf(cpf),
        onSuccess: (data: ClientResponse) => {
            queryClient.invalidateQueries({ queryKey: ["client"] })
            form.setValue("clientId", data.id)
            setClientName(data ? data.firstName + " " + data.lastName : "")
        },
        onError: () => {
            toast.error("Erro ao buscar cpf")
        }
    })

    const handleCpfSearch = () => {
        if (cpfValue) {
            cpfFindMutation(cpfValue)
        }
    }

    const stayGuestsFields = useFieldArray({
        control: form.control,
        name: "stayGuests",
    })

    const totalGuests = form.watch("totalGuests")

    useEffect(() => {
        const currentCount = stayGuestsFields.fields.length
        const desiredCount = Math.max(0, (totalGuests ?? 1) - 1)

        if (desiredCount > currentCount) {
            for (let i = currentCount; i < desiredCount; i += 1) {
                stayGuestsFields.append({ name: "" })
            }
        }

        if (desiredCount < currentCount) {
            for (let i = currentCount; i > desiredCount; i -= 1) {
                stayGuestsFields.remove(i - 1)
            }
        }
    }, [totalGuests, stayGuestsFields])

    const submitMutation = useMutation({
        mutationFn: (data: StayRequest) => stayService.newStay(data),
        onSuccess: () => {
            toast.success("Hospedagem registrada com sucesso")
            queryClient.invalidateQueries({queryKey: ['rooms']})
            handleClose()
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] })
            toast.error("Falha ao registrar hospedagem")
        }
    })

    const subtmit = (data: StayRequest) => {
        submitMutation.mutate(data as StayRequest)
    }

    return (
        <DialogContent className="sm:max-w-xl">
            <form onSubmit={form.handleSubmit(subtmit)} className="space-y-5">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-lg font-semibold">
                        {manageType === "AVAILABLE" ? `Check-in Apartamento ${roomId}` : `Atualizar hospedagem ${roomId}`}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Preencha os dados da hospedagem para prosseguir.
                    </DialogDescription>
                </DialogHeader>

                <input type="hidden" {...form.register("roomId")} />

                <FieldGroup className="grid gap-4 md:grid-cols-2">

                <input type="hidden" {...form.register("clientId")} />

                    <Field className="col-span-full">
                        <div className="flex w-full items-center gap-2.5">
                            <InputMask
                                value={cpfValue}
                                component={Input}
                                replacement={{ _: /\d/ }}
                                mask="___.___.___-__"
                                placeholder="000.000.000-00"
                                className="flex-1"
                                onChange={(e) => {
                                    setCpfValue(e.target.value)
                                    if (cpfError) {
                                        cpfReset()
                                    }
                                }}
                            />
                            <Button disabled={cpfPending} type="button" onClick={handleCpfSearch} className="shrink-0">
                                {cpfPending ? "Buscando..." : "Buscar CPF"}
                            </Button>
                        </div>
                    </Field>

                    <Controller
                        name="checkIn"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="sm:w-auto">
                                <FieldLabel htmlFor="checkIn">Entrada</FieldLabel>
                                <div>
                                    <Input
                                        type='datetime-local'
                                        inputMode='text'
                                        className="rounded-lg border"
                                        {...field}
                                        id="checkIn"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>

                        )}
                    />

                    <Controller
                        name="checkOut"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="sm:w-auto">
                                <FieldLabel htmlFor="checkOut">Saída</FieldLabel>
                                <div>
                                    <Input
                                        type='datetime-local'
                                        className="rounded-lg border p-2"
                                        {...field}
                                        id="checkOut"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Field className="flex flex-col justify-between gap-2 rounded-xl border border-border/70 bg-muted/50 p-4">
                        <FieldLabel>Cliente</FieldLabel>
                        <FieldContent className="text-sm text-muted-foreground">
                            {clientName || 'Nenhum cliente selecionado'}
                        </FieldContent>
                    </Field>

                    <Field className="rounded-xl border border-border/70 bg-background/70 p-4">
                        <FieldLabel htmlFor="totalGuests">Total de hóspedes</FieldLabel>
                        <Input
                            id="totalGuests"
                            type="number"
                            min={1}
                            className="mt-2"
                            {...form.register("totalGuests", { valueAsNumber: true })}
                        />
                    </Field>
                    {totalGuests > 1 && (
                        <Field className="col-span-full rounded-xl border border-border/70 bg-muted/40 p-4">
                            <FieldLabel>Hóspedes extras</FieldLabel>
                            <div className="mt-3 space-y-3">
                                {stayGuestsFields.fields.map((guest, index) => {
                                    const error = form.formState.errors.stayGuests?.[index]?.name
                                    return (
                                        <Field key={guest.id} className="flex items-center gap-2.5">
                                            <Input
                                                placeholder={`Nome do hóspede ${index + 2}`}
                                                {...form.register(`stayGuests.${index}.name`)}
                                            />
                                            {stayGuestsFields.fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => stayGuestsFields.remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {error && <FieldError errors={[error]} />}
                                        </Field>
                                    )
                                })}
                            </div>
                        </Field>
                    )}
                </FieldGroup>

                <DialogFooter className="flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                    <DialogClose render={<Button onClick={handleClose} variant="outline">Cancelar</Button>} />
                    <Button type="submit">Salvar hospedagem</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default ManageRoom