import RoomCard from '@/components/room/extended-room-card'
import { roomService } from '@/api/room'
import { useQuery } from '@tanstack/react-query'
import SpinnerComp from '@/components/spinner/spiner'
import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SimpleRoomCard from '@/components/room/simple-room-card'

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
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
                        {orderedRooms.map((room) => (
                            <Dialog key={room.id}>
                                <DialogTrigger
                                    render={<Button
                                        variant='outline'
                                        className='h-auto w-full justify-start whitespace-normal'
                                    />}
                                >
                                    <div className='w-full p-4'>
                                        <SimpleRoomCard room={room} />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl'>
                                    <RoomCard room={room} />
                                </DialogContent>
                            </Dialog>
                        )
                        )}
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}

export default HomePage