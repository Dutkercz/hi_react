import type { RoomResponse } from "@/api/room"
import { CardDescription } from "../ui/card"
import { BedDoubleIcon, BedSingle, UserRoundIcon } from "lucide-react"

type SimpleRoomCardProps = {
    room: RoomResponse
}

const SimpleRoomCard = ({ room }: SimpleRoomCardProps) => {

    const clientName = room.stay?.client
        ? `${room.stay.client.firstName} ${room.stay.client.lastName}`
        : null

    const roomStatusLabel = {
        AVAILABLE: 'Disponível',
        OCCUPIED: 'Ocupado',
        MAINTENANCE: 'Manutenção',
        RESERVED: 'Reservado',
    } as const

    const roomStatusClasses = {
        AVAILABLE: 'bg-emerald-500/10 text-emerald-700',
        OCCUPIED: 'bg-sky-500/10 text-sky-700',
        MAINTENANCE: 'bg-amber-500/10 text-amber-700',
        RESERVED: 'bg-violet-500/10 text-violet-700',
    } as const

    return (
        <div>
            <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                    <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Apartamento</p>
                    <p className='text-xl font-semibold'>{room.roomNumber ?? '—'}</p>
                </div>
                <span className={`rounded-lg px-2 py-1 text-xs font-medium ${roomStatusClasses[room.status]}`}>
                    {roomStatusLabel[room.status]}
                </span>
            </div>

            <div className='flex min-w-0 items-center justify-center gap-2 border-t border-border/60 pt-3'>
                {clientName ? (
                    <>
                        <div className='flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <UserRoundIcon className='size-4' />
                        </div>
                        <div >

                            <p className='truncate text-sm font-medium'>{clientName}</p>
                        </div>
                    </>
                ) 
                : 
                (
                    <div className='flex min-w-0 items-center gap-3 text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                            <BedSingle className='size-5' />
                            <span className='text-sm font-semibold'>{room.singleBeds}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <BedDoubleIcon className='size-5' />
                            <span className='text-sm font-semibold'>{room.doubleBeds}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className='min-w-0'>
                {room.stay?.dailyRates &&
                    <CardDescription>
                        {room.stay?.dailyRates} Diárias
                    </CardDescription>
                }
                <CardDescription>Clique para ver detalhes</CardDescription>
            </div>
        </div>
    )
}

export default SimpleRoomCard