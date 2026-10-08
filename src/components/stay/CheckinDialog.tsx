import { Button } from '../ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Controller, useFieldArray } from "react-hook-form"
import { Input } from '../ui/input'
import { useStayRequest } from '@/hooks/useStayRequest'
import InputMask from '@react-input/mask/InputMask'
import { useEffect } from 'react'
import { useRoomCard } from '../../hooks/useRoomCard'
import { Checkbox } from '../ui/checkbox'
import type { RoomResponse } from '@/types/room'

type ManageRoomProps = {
    setOpen: (v: boolean) => void
    room: RoomResponse
}

const CheckinDialog = ({ setOpen, room }: ManageRoomProps) => {
    const { dailyPrice, formatCurrency } = useRoomCard(room)

    const { cpfValue, handleCpfChange, clientName, cpfPending,
        handleClose, handleCpfSearch, form, subtmitStay, stayPending } = useStayRequest(room.id, setOpen)


    const { fields: stayGuestFields, append: appendStayGuest, remove: removeStayGuest } = useFieldArray({
        control: form.control,
        name: "stayGuests",
    })

    const totalGuests = form.watch("totalGuests")

    useEffect(() => {
        const currentCount = stayGuestFields.length
        const desiredCount = Math.max(0, (totalGuests ?? 1) - 1)

        if (desiredCount > currentCount) {
            for (let i = currentCount; i < desiredCount; i += 1) {
                appendStayGuest({ name: "" })
            }
        }

        if (desiredCount < currentCount) {
            for (let i = currentCount; i > desiredCount; i -= 1) {
                removeStayGuest(i - 1)
            }
        }
    }, [totalGuests, stayGuestFields.length, appendStayGuest, removeStayGuest])

    return (
        <DialogContent className="sm:max-w-xl">
            <form onSubmit={form.handleSubmit(subtmitStay)} className="space-y-5">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-lg font-semibold">
                        Check-in Apartamento {room.roomNumber}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Preencha os dados da hospedagem para prosseguir.
                    </DialogDescription>
                </DialogHeader>

                {room?.id && (
                    <input type="hidden" {...form.register("roomId", { valueAsNumber: true })} />
                )}

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
                                disabled={cpfPending}
                                onChange={(e) => handleCpfChange(e.target.value)}
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
                            {clientName &&
                                <div>Diária <span>{formatCurrency(dailyPrice[totalGuests as keyof typeof dailyPrice] ?? 0)}</span></div>
                            }
                        </FieldContent>

                        <Controller
                            name='isPaid'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div >
                                    <Field data-invalid={fieldState.invalid} >
                                        <FieldContent className="flex flex-row items-center space-x-3 space-y-0">
                                            <FieldLabel htmlFor='isPaid'>Pago no chekcin</FieldLabel>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FieldContent>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                </div>
                            )}
                        />
                    </Field>

                    <Controller
                        name="totalGuests"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}
                                className="">
                                <FieldLabel htmlFor="totalGuests">Total de hóspedes</FieldLabel>
                                <Input
                                    id="totalGuests"
                                    type="number"
                                    {...field}
                                    min={1}
                                    autoComplete='off'
                                    className="mt-2"
                                    onChange={(event) => field.onChange(event.target.valueAsNumber)}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />


                    {totalGuests > 1 && (
                        <Field className="col-span-2 rounded-xl border border-border/70 bg-muted/40 p-4">
                            <FieldLabel>Hóspedes extras</FieldLabel>
                            <div className="mt-3 space-y-3">
                                {stayGuestFields.slice(0, 3).map((guest, index) => {
                                    const error = form.formState.errors.stayGuests?.[index]?.name
                                    return (
                                        <Field key={guest.id} className="flex items-center gap-2.5">
                                            <Input
                                                autoComplete='off'
                                                placeholder={`Nome do hóspede ${index + 2}`}
                                                {...form.register(`stayGuests.${index}.name`)}
                                            />
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
                    <Button type="submit" disabled={stayPending}>
                        {stayPending ? "Salvando..." : "Salvar hospedagem"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default CheckinDialog