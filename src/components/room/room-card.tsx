import { BedDoubleIcon, BedIcon, CreditCardIcon, UserRoundIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { type RoomResponse } from '@/api/room'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { useState } from 'react'
import ManageStay from './manage-stay-dialog'
import { useRoomCard } from './useRoomCard'
import AddPaymentDialog from '../payment/add-payment-dialog'

type RoomCardProps = {
    room: RoomResponse
}

const guestOptions = [1, 2, 3, 4] as const

const RoomCard = ({ room }: RoomCardProps) => {
    const stay = room.stay
    const [open, setOpen] = useState(false)
    const [openAddPay, setOpenAddPay] = useState(false)

    const { addDailyMutation, formatCurrency, dailyPrice,
        roomStatus, roomStatusClasses, stayStatus } = useRoomCard(room)


    return (
        <Card className='h-full border-border/70 shadow-sm'>
            <CardHeader>
                <div className='flex flex-wrap items-start justify-between gap-2'>
                    <CardTitle className={`rounded-lg px-2.5 py-1 text-xs font-medium ${roomStatusClasses}`}>Apartamento {room.roomNumber ?? '—'}</CardTitle>
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${roomStatusClasses}`}>
                        {roomStatus}
                    </span>
                </div>
            </CardHeader>

            <CardContent className='flex flex-col gap-3 text-sm'>
                <div className='flex flex-wrap items-center justify-center gap-2'>
                    {room.singleBeds > 0 &&
                        <div className='flex items-center justify-center gap-2 rounded-lg bg-muted/60 p-2'>
                            <BedIcon className='size-4' />
                            <p className='text-center text-muted-foreground font-medium'>
                                Cama solteiro <span className='font-extrabold'>{room.singleBeds}</span>
                            </p>
                        </div>
                    }
                    <div className='rounded-lg bg-muted/60 p-2 flex items-center justify-center gap-2'>
                        <BedDoubleIcon className='size-4' />
                        <p className='text-center text-muted-foreground font-medium'>
                            Cama casal <span className='font-extrabold'>{room.doubleBeds}</span>
                        </p>
                    </div>
                </div>

                {stay?.client?.id &&
                    <div className='rounded-xl border border-border/70 bg-muted/20 p-3'>
                        <div className='mb-3 flex items-center gap-2 border-b border-border/60 pb-3'>
                            <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                <UserRoundIcon className='size-4' />
                            </div>
                            <div className='min-w-0'>
                                <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Hóspede</p>
                                <p className='truncate font-semibold'>{stay.client.firstName} {stay.client.lastName}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-2'>
                            <div>
                                <p className='text-xs text-muted-foreground'>Status</p>
                                <p className='font-medium'>{stayStatus[stay.stayStatus]}</p>
                            </div>
                            <div>
                                <p className='text-xs text-muted-foreground'>Diárias</p>
                                <p className='font-medium'>{stay.dailyRates}</p>
                            </div>
                            <div>
                                <p className='text-xs text-muted-foreground'>Check-in</p>
                                <p className='font-medium'>{new Date(stay.checkIn).toLocaleDateString('pt-BR')}</p>
                            </div>
                            {stay.checkOut && (
                                <div>
                                    <p className='text-xs text-muted-foreground'>Check-out</p>
                                    <p className='font-medium'>{new Date(stay.checkOut).toLocaleDateString('pt-BR')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </CardContent>

            <CardFooter className='flex flex-col items-center rounded-lg gap-3 m-1'>
                {stay ?
                    <div className='grid w-full grid-cols-2 gap-2'>
                        <div className='rounded-lg border border-border/70 bg-muted p-2'>
                            <p className='text-xs text-muted-foreground'>Valor diária</p>
                            <p className='font-semibold'>
                                {formatCurrency(stay?.dailyPrice)}
                            </p>
                        </div>
                        <div className='flex min-w-0 flex-col rounded-lg border border-border/70 bg-muted p-2'>
                            <p className='text-xs text-muted-foreground'>Valor pago</p>
                            <p className='font-semibold'>
                                {formatCurrency(stay?.paidPrice)}
                            </p>

                            <Dialog open={openAddPay} onOpenChange={setOpenAddPay}>
                                <DialogTrigger className="flex-1 flex" render={<Button className='mt-2 w-full' size='sm' variant='outline'>
                                    <CreditCardIcon /> Registrar
                                </Button>}>
                                </DialogTrigger>
                                <AddPaymentDialog room={room} setOpen={setOpenAddPay} />
                            </Dialog>

                        </div>
                        <div className='flex min-w-0 flex-col rounded-lg border border-border/70 bg-muted p-2'>
                            <p className='text-xs text-muted-foreground'>A pagar</p>
                            <p className='font-semibold'>
                                {formatCurrency(stay?.remainingPrice)}
                            </p>
                            <Button className='mt-2 w-full' size='sm' variant='outline' disabled>
                                <CreditCardIcon /> Cobrar
                            </Button>
                        </div>
                        <div className='rounded-lg border border-border/70 bg-muted p-2'>
                            <p className='text-xs text-muted-foreground'>Total</p>
                            <p className='font-semibold'>
                                {formatCurrency(stay?.totalPrice)}
                            </p>
                        </div>
                    </div>
                    :
                    <div className='w-full rounded-lg border-2 bg-muted p-3'>
                        <h2 className='mb-2 text-center text-lg font-semibold text-muted-foreground'>Preços</h2>
                        <div className='grid grid-cols-2 gap-2 text-sm sm:grid-cols-4'>
                            {guestOptions.map((guests) => (
                                <p key={guests} className='flex flex-col rounded-md bg-background/60 p-2'>
                                    <span>{guests.toString().padStart(2, '0')} pessoa{guests > 1 ? 's' : ''}</span>
                                    <span className='font-medium text-muted-foreground'>{formatCurrency(dailyPrice[guests])}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                }
                <CardAction className='w-full flex justify-center'>
                    <div className='flex w-full flex-col items-stretch justify-center gap-2 sm:flex-row'>
                        {room.stay &&
                            <Button className="flex-1" onClick={() => addDailyMutation.mutate()}>
                                Adicionar diária
                            </Button>
                        }

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger className="flex-1 flex" render={<Button className="w-full"
                                onClick={() => setOpen(true)} variant={room.status === 'AVAILABLE' ? 'default' : 'destructive'}>
                                {room.status === 'AVAILABLE' ? 'Check-in' : 'Check-out'}
                            </Button>}>
                            </DialogTrigger>
                            <ManageStay room={room} setOpen={setOpen} />
                        </Dialog>
                    </div>
                </CardAction>
            </CardFooter>
        </Card>
    )
}

export default RoomCard