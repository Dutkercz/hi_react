import { roomService, type RoomResponse } from "@/api/room"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useRoomCard = (room: RoomResponse) => {

    const queryClient = useQueryClient()

    const addDailyMutation = useMutation({
        mutationFn: () => roomService.addDaily(room.id),
        onSuccess: () => {
            toast.success("Diária adicionada com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["rooms"] })
        },
        onError: () => {
            toast.error("Erro ao adicionar diária.")
            queryClient.invalidateQueries({ queryKey: ["rooms"] })
        }
    })

    const formatCurrency = (value: number | null | undefined) => {
        if (typeof value !== 'number') return '—'
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const dailyPrice = {
        1: 160.00,
        2: 260.00,
        3: 390.00,
        4: 490.00
    }

    const roomStatus = {
        AVAILABLE: 'Disponível',
        OCCUPIED: 'Ocupado',
        MAINTENANCE: 'Manutenção',
        RESERVED: 'Reservado',
    }[room.status]

    const roomStatusClasses = {
        AVAILABLE: 'bg-emerald-500/10 text-emerald-700',
        OCCUPIED: 'bg-sky-500/10 text-sky-700',
        MAINTENANCE: 'bg-amber-500/10 text-amber-700',
        RESERVED: 'bg-violet-500/10 text-violet-700',
    }[room.status]

    const stayStatus = {
        CURRENT: "Em andamento",
        CANCELED: "Cancelada",
        FINISHED: "Finalizada"
    }

    return { addDailyMutation, formatCurrency, roomStatus, roomStatusClasses, stayStatus, dailyPrice }
}