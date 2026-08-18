import { BedDoubleIcon, BedIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { type RoomResponse } from '@/api/room'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { useState } from 'react'
import ManageRoom from './manage-room-dialog'
import { useRoomCard } from './useRoomCard'

type RoomCardProps = {
    room: RoomResponse
}

const RoomCard = ({ room }: RoomCardProps) => {
    const stay = room.stay
    const [open, setOpen] = useState(false)

    const { addDailyMutation, formatCurrency, dailyPrice,
        roomStatus, roomStatusClasses, stayStatus } = useRoomCard(room)


    return (
        <Card className='h-full border-border/70 shadow-sm'>
            <CardHeader >
                <div className='flex items-start justify-between'>
                    <CardTitle className={`rounded-lg px-2.5 py-1 text-xs font-medium ${roomStatusClasses}`}>Apartamento {room.roomNumber ?? '—'}</CardTitle>
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${roomStatusClasses}`}>
                        {roomStatus}
                    </span>
                </div>
            </CardHeader>

            <CardContent className='flex flex-col gap-3 text-sm'>
                <div className='flex items-center justify-center gap-2'>
                    {room.singleBeds > 0 &&
                        <div className='c rounded-lg bg-muted/60 p-2 flex items-center justify-center gap-2'>
                            <BedIcon />
                            <p className='text-center text-muted-foreground font-medium'>
                                Cama solteiro <span className='font-extrabold'>{room.singleBeds}</span>
                            </p>
                        </div>
                    }
                    <div className='rounded-lg bg-muted/60 p-2 flex items-center justify-center gap-2'>
                        <BedDoubleIcon />
                        <p className='text-center text-muted-foreground font-medium'>
                            Cama casal <span className='font-extrabold'>{room.doubleBeds}</span>
                        </p>
                    </div>
                </div>

                {stay?.client?.id &&
                    <div className='rounded-lg border border-border/70 p-3'>
                        <p className='font-medium'>Cliente: {stay.client.firstName} {stay.client.lastName}</p>
                        <p className='text-sm text-muted-foreground'>Status: {stayStatus[stay.stayStatus]}</p>
                        <p className='text-sm text-muted-foreground'>Checkin: {new Date(stay.checkIn).toLocaleDateString('pt-BR')}</p>
                        {stay.checkOut && (
                            <p className='text-sm text-muted-foreground'>Checkout: {new Date(stay.checkOut).toLocaleDateString('pt-BR')}</p>

                        )}
                    </div>
                }
            </CardContent>

            <CardFooter className='flex flex-col items-center rounded-lg gap-3 m-1'>
                {stay ? 
                    <div className='flex items-center justify-center gap-1'>
                        <div className='rounded-lg border border-border/70 p-2 bg-muted'>
                            <p className='text-xs text-muted-foreground'>Valor Diária</p>
                            <p className='font-medium'>
                                {formatCurrency(stay?.dailyPrice)}
                            </p>
                        </div>
                        <div className='rounded-lg border border-border/70 p-2 bg-muted'>
                            <p className='text-xs text-muted-foreground'>Valor Pago</p>
                            <p className='font-medium'>
                                {formatCurrency(stay?.partialPrice ?? stay?.totalPrice ?? stay?.dailyPrice)}
                            </p>
                        </div>
                        <div className='rounded-lg border border-border/70 p-2 bg-muted'>
                            <p className='text-xs text-muted-foreground'>A pagar</p>
                            <p className='font-medium'>
                                {formatCurrency(stay?.partialPrice ?? stay?.totalPrice ?? stay?.dailyPrice)}
                            </p>
                        </div>
                        <div className='rounded-lg border border-border/70 p-2 bg-muted'>
                            <p className='text-xs text-muted-foreground'>Total</p>
                            <p className='font-medium'>
                                {formatCurrency(stay?.totalPrice)}
                            </p>
                        </div>
                    </div>
                    :
                    <div className='border-2 bg-muted rounded-lg p-2'>
                        <h2 className='text-muted-foreground text-center mb-2 text-xl'>Preços</h2>
                        <div className='flex gap-2'>
                            <p>01 Pessoa <span className='text-muted-foreground'>{formatCurrency(dailyPrice[1])}</span></p>
                            <p>02 Pessoa <span className='text-muted-foreground'>{formatCurrency(dailyPrice[2])}</span></p>
                            <p>03 Pessoa <span className='text-muted-foreground'>{formatCurrency(dailyPrice[3])}</span></p>
                            <p>04 Pessoa <span className='text-muted-foreground'>{formatCurrency(dailyPrice[4])}</span></p>
                        </div>
                    </div>
                }
                <CardAction className='w-full flex justify-center'>
                    <div className='flex items-center justify-center w-full gap-2'>
                        {room.stay &&
                            <Button className="flex-1" onClick={() => addDailyMutation.mutate()}>
                                Adicionar diária
                            </Button>
                        }

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger className="flex-1 flex" render={<Button className="w-full"
                                onClick={() => setOpen(true)} variant={room.status === 'AVAILABLE' ? 'default' : 'outline'}>
                                {room.status === 'AVAILABLE' ? 'Check-in' : 'Check-out'}
                            </Button>}>
                            </DialogTrigger>
                            <ManageRoom room={room} setOpen={setOpen} />
                        </Dialog>
                    </div>
                </CardAction>
            </CardFooter>
        </Card>
    )
}

export default RoomCard