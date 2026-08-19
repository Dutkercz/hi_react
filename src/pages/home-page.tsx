import RoomCard from '@/components/room/room-card'
import { roomService } from '@/api/room'
import { useQuery } from '@tanstack/react-query'
import SpinnerComp from '@/components/spinner/spiner'
import React from 'react'
import { Separator } from '@/components/ui/separator'

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
        <>
            <div className='grid grid-cols-3 gap-2 p-2'>
                {orderedRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
                <Separator />
            </div>
        </>
    )
}

export default HomePage