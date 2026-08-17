import RoomCard from '@/components/room/room-card'
import { roomService } from '@/api/room'
import { useQuery } from '@tanstack/react-query'
import SpinnerComp from '@/components/spinner/spiner'

const HomePage = () => {

    const { data: rooms, isLoading } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.getAll(),
    })

    if(isLoading) return <><SpinnerComp /></>

    return (
        <>
            <div className='grid grid-cols-3 gap-2'>
                {rooms && rooms?.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </>
    )
}

export default HomePage