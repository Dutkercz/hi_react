import { BedDoubleIcon, BedIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { type RoomResponse } from '@/api/room'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { useState } from 'react'
import ManageRoom from './manage-room-dialog'

type RoomCardProps = {
    room: RoomResponse
}

const RoomCard = ({ room }: RoomCardProps) => {
    const totalGuests = room.doubleBeds * 2 + room.singleBeds
    const stay = room.stay

    const formatCurrency = (value: number | null | undefined) => {
        if (typeof value !== 'number') return '—'
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const statusLabel = {
        AVAILABLE: 'Disponível',
        OCCUPIED: 'Ocupado',
        MAINTENANCE: 'Manutenção',
        RESERVED: 'Reservado',
    }[room.status]

    const statusClasses = {
        AVAILABLE: 'bg-emerald-500/10 text-emerald-700',
        OCCUPIED: 'bg-sky-500/10 text-sky-700',
        MAINTENANCE: 'bg-amber-500/10 text-amber-700',
        RESERVED: 'bg-violet-500/10 text-violet-700',
    }[room.status]

    const [open, setOpen] = useState(false)

    return (
        <Card size='sm' className='h-full border-border/70 shadow-sm'>
            <CardHeader>
                <div className='flex items-start justify-between gap-3'>
                    <div className='rounded-lg bg-muted/60 p-2'>
                        <CardTitle>Apto {room.roomNumber ?? '—'}</CardTitle>
                        <CardDescription>Acomodação para até <span className='font-extrabold'>{totalGuests}</span> pessoas</CardDescription>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses}`}>
                        {statusLabel}
                    </span>
                </div>
            </CardHeader>

            <CardContent className='flex flex-col gap-3 text-sm'>
                <div className='grid grid-cols-2 gap-2'>
                    <div className='rounded-lg bg-muted/60 p-2 flex items-center justify-center gap-2'>
                        <BedIcon />
                        <p className='text-center text-muted-foreground font-medium'>
                            Cama solteiro <span className='font-extrabold'>{room.singleBeds}</span>
                        </p>
                    </div>
                    <div className='rounded-lg bg-muted/60 p-2 flex items-center justify-center gap-2'>
                        <BedDoubleIcon />
                        <p className='text-center text-muted-foreground font-medium'>
                            Cama casal <span className='font-extrabold'>{room.doubleBeds}</span>
                        </p>
                    </div>
                </div>

                {stay?.client?.id &&
                    <div className='rounded-lg border border-border/70 p-3'>
                        <p className='text-xs text-muted-foreground'>Estadia ativa</p>
                        <p className='font-medium'>Cliente: {stay.client.firstName} {stay.client.lastName}</p>
                        <p className='text-sm text-muted-foreground'>Status: {stay.stayStatus}</p>
                        <p className='text-sm text-muted-foreground'>Check-in: {new Date(stay.checkIn).toLocaleDateString('pt-BR')}</p>
                        {stay.checkOut && (
                            <p className='text-sm text-muted-foreground'>Check-out: {new Date(stay.checkOut).toLocaleDateString('pt-BR')}</p>
                        )}
                    </div>
                }
            </CardContent>

            <CardFooter className='flex items-center justify-between gap-2'>
                <div>
                    <p className='text-xs text-muted-foreground'>Valor</p>
                    <p className='font-medium'>
                        {formatCurrency(stay?.partialPrice ?? stay?.totalPrice ?? stay?.dailyPrice)}
                    </p>
                </div>
                <CardAction>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button onClick={() => setOpen(true)} size='sm' variant={room.status === 'AVAILABLE' ? 'default' : 'outline'}>
                            {room.status === 'AVAILABLE' ? 'Check-in' : 'Check-out'}
                        </Button>}>
                        </DialogTrigger>
                        <ManageRoom roomId={room.id} setOpen={setOpen} manageType={room.status} />
                    </Dialog>


                </CardAction>
            </CardFooter>
        </Card>
    )
}

export default RoomCard