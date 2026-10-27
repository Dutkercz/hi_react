import type { BackendError } from "@/types/backendError"
import SpinnerComp from "@/components/spinner/Spinner"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import AdminRoomCard from "./AdminRoomCard"
import { roomService } from "@/service/room"
import type { RoomUpdateRequest } from "@/types/room"
import { Button } from "../ui/button"
import ErrorComp from "../error/ErrorComp"

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

    const addRoomMutation = useMutation({
        mutationFn: () => roomService.addRoom(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
            toast.success("Sucesso ao adicionar novo Apartamento")
        },
        onError: (error: AxiosError<BackendError>) => {
            toast.error("Erro ao adicionar apartamento: " + error.response?.data.detail)
        }
    })

    const handleAddRoom = () => {
        addRoomMutation.mutate()
    }

    const deleteRoomMutation = useMutation({
        mutationFn: (id: number) => roomService.deleteRoom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] })
            toast.success("Sucesso ao excluir Apartamento")
        },
        onError: (error: AxiosError<BackendError>) => {
            toast.error("Erro ao excluir apartamento: " + error.response?.data.detail)
        }
    })

    const handleDeleteRoom = (id: number) => {
        deleteRoomMutation.mutate(id)
    }

    if (isLoading) return <SpinnerComp />
    if (isError) return <ErrorComp />

    return (
        <div>
            <CardTitle className="m-1 text-center text-2xl">Gerenciar Apartamentos</CardTitle>
            <CardDescription className="ml-2 text-center">Editar a configuração dos apartamentos</CardDescription>
            <div className="grid gap-2 m-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {rooms?.map((room) => (
                    <div key={room.id} className="p-2 border bg-muted rounded-lg">
                        <AdminRoomCard onSubmitEdit={handleSubmitEdit} onSubmitDelete={handleDeleteRoom}
                        room={room} key={room.id} />
                    </div>
                ))}
                <div className="flex items-center justify-center border bg-muted rounded-lg">
                    <Button

                        onClick={handleAddRoom} >Adicionar Apartamento</Button>
                </div>
            </div>
        </div>
    )
}

export default AdminRoom