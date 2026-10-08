import type { BackendError } from "@/types/backendError"
import SpinnerComp from "@/components/spinner/Spinner"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import AdminRoomCard from "./AdminRoomCard"
import { roomService } from "@/service/room"
import type { RoomUpdateRequest } from "@/types/room"

const AdminRoom = () => {

    const queryClient = useQueryClient()

    const { data: rooms, isLoading, isError } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => roomService.getAll()
    })

    const updateRoomConfigMutation = useMutation({
        mutationFn: ({ id, room }: { id: number, room: RoomUpdateRequest }) => {
            return roomService.updateRoomConfig(id, room)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
            toast.success("Sucesso ao realizar o reembolso")
        },
        onError: (erro: AxiosError<BackendError>) => {
            const mensagemApi = erro.response?.data?.detail || "Erro desconhecido";
            toast.error("Erro ao realizar reembolso: " + mensagemApi)
        }
    })

    const handleSubmitEdit = (id: number, room: RoomUpdateRequest) => {
        updateRoomConfigMutation.mutate({ id, room })
    }

    if (isLoading) return <SpinnerComp />
    if (isError) return <div>Erro</div>

    return (
        <div>
            <CardTitle className="m-1 text-center text-2xl">Gerenciar Apartamentos</CardTitle>
            <CardDescription className="ml-2 text-center">Editar a configuração dos apartamentos</CardDescription>
            <div className="grid grid-cols-3 gap-2 m-2">
                {rooms?.map((room) => (
                    <div key={room.id} className="p-2 border bg-muted rounded-lg">
                        <AdminRoomCard onSubmit={handleSubmitEdit} room={room} key={room.id} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminRoom