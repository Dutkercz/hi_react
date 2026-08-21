import RoomCard from '@/components/room/room-card'
import { roomService } from '@/api/room'
import { useQuery } from '@tanstack/react-query'
import SpinnerComp from '@/components/spinner/spiner'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BedDoubleIcon, BedIcon, UserRoundIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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

const HomePage = () => {

    const { data: rooms, isLoading } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.getAll(),
    })

    const orderedRooms = React.useMemo(() => {
        if (!rooms) return [];

        return [...rooms].sort((a, b) => {
            if (a.status === 'OCCUPIED' && b.status !== 'OCCUPIED') return -1;
            if (a.status !== 'OCCUPIED' && b.status === 'OCCUPIED') return 1;
            return 0;
        });
    }, [rooms]);

    if (isLoading) return <><SpinnerComp /></>

    return (
        <Card className='min-h-screen'>
            <div className='mx-auto'>
                <CardHeader className='mb-4'>
                    <CardTitle className='text-xl text-center'>Visão geral</CardTitle>
                </CardHeader>
                <Separator className="m-4" />
                <CardContent>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
                        {orderedRooms.map((room) => {
                            const clientName = room.stay?.client
                                ? `${room.stay.client.firstName} ${room.stay.client.lastName}`
                                : null

                            return (
                                <Dialog key={room.id}>
                                    <DialogTrigger
                                        render={<Button
                                            variant='outline'
                                            className='h-auto w-full justify-start whitespace-normal'
                                        />}
                                    >
                                        <div className='w-full p-4'>
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
                                                ) : (
                                                    <div className='flex min-w-0 items-center gap-3 text-muted-foreground'>
                                                        <div className='flex items-center gap-1'>
                                                            <BedIcon className='size-4' />
                                                            <span className='text-sm font-semibold'>{room.singleBeds}</span>
                                                        </div>
                                                        <div className='flex items-center gap-1'>
                                                            <BedDoubleIcon className='size-4' />
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
                                    </DialogTrigger>
                                    <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl'>
                                        <DialogTitle className='sr-only'>Detalhes do apartamento {room.roomNumber ?? '—'}</DialogTitle>
                                        <DialogDescription className='sr-only'>Informações completas da hospedagem e ações do apartamento.</DialogDescription>
                                        <RoomCard room={room} />
                                    </DialogContent>
                                </Dialog>
                            )
                        })}
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}

export default HomePage