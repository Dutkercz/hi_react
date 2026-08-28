import { roomService, type RoomResponse } from "@/api/room"
import { stayService } from "@/api/stay"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"

type BackendError = {
    message?: string;
  }

export const useRoomCard = (room: RoomResponse) => {

    const queryClient = useQueryClient()

    const addDailyMutation = useMutation({
        mutationFn: () => roomService.addDaily(room.id),
        onSuccess: () => {
            toast.success("Diária adicionada com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["rooms"] })
        },
        onError: (erro : AxiosError<BackendError>) => {
            const mensagemApi = erro.response?.data?.message || "Erro desconhecido";
            toast.error("Erro ao adicionar diária: " + mensagemApi)
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

    const mutationUpdateStay = useMutation({
        mutationFn : () => stayService.updateStay(room.stay?.id?? -1),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['rooms']}),
        onError: (erro : AxiosError<BackendError>) => {
            const mensagemApi = erro.response?.data?.message || "Erro desconhecido";
            toast.error("Erro ao autlizar diária: " + mensagemApi)
        } 
    })

    const handleUpdateStay = () => {
        
        mutationUpdateStay.mutate()
    }

    const mutationCheckout = useMutation({
        mutationFn : (stayId : number) => stayService.checkOut(stayId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['rooms']})
            toast.success("Sucesso ao realizar checkout")
        },
        onError: (erro : AxiosError<BackendError>) => {
            const mensagemApi = erro.response?.data?.message || "Erro desconhecido";
            toast.error("Erro ao realizar checkout: " + mensagemApi)
        } 
    })

    const handleCheckout = (stayId : number) => {
        mutationCheckout.mutate(stayId)
    }

    return { addDailyMutation, formatCurrency, roomStatus, roomStatusClasses, 
        stayStatus, dailyPrice, handleUpdateStay, handleCheckout }
}