import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { staySchema } from "../schemas/stayRequestSchema"
import type { StayRequest } from "@/types/stays"
import { clientService } from "@/service/client"
import type { ClientResponse } from "@/types/client"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { stayService } from "@/service/stay"
import type { AxiosError } from "axios"
import type { BackendError } from "@/types/backendError"

export const useStayRequest = (id: number, setOpen: (v: boolean) => void) => {
    const form = useForm<StayRequest>({
        resolver: zodResolver(staySchema),
        defaultValues: {
            clientId: undefined,
            roomId: id,
            checkIn: "",
            checkOut: "",
            totalGuests: 1,
            isPaid: false,
            stayGuests: [],
        },
        shouldUnregister: true,
        mode: "onBlur"
    })


    const [cpfValue, setCpfValue] = useState("")
    const queryClient = useQueryClient()
    const [clientName, setClientName] = useState("")

    const { mutate: cpfFindMutation, isPending: cpfPending, reset: cpfReset } = useMutation({
        mutationKey: ["client"],
        mutationFn: (cpf: string) => clientService.findByCpf(cpf),
        onSuccess: (data: ClientResponse) => {
            queryClient.invalidateQueries({ queryKey: ["client"] })
            form.setValue("clientId", data.id)
            setClientName(data ? data.firstName + " " + data.lastName : "")
        },
        onError: (err : AxiosError<BackendError>) => {
            toast.error("Erro ao buscar cpf: " + err.response?.data.detail)
        }
    })

    const handleCpfChange = (value: string) => {
        setCpfValue(value)
        setClientName("")
        form.resetField("clientId")
        cpfReset()
    }

    const handleCpfSearch = () => {
        if (cpfValue) {
            cpfFindMutation(cpfValue)
        }
    }

    const handleClose = () => {
        setClientName("")
        setCpfValue("")
        cpfReset()
        form.reset()
        setOpen(false)
    }

    const { mutate: submitStay, isPending: stayPending } = useMutation({
        mutationFn: (data: StayRequest) => stayService.newStay(data),
        onSuccess: () => {
            toast.success("Hospedagem registrada com sucesso")
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
            handleClose()
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] })
            toast.error("Falha ao registrar hospedagem")
        }
    })

    const subtmitStay = (data: StayRequest) => {
        submitStay(data)
    }

    return {
        cpfValue, handleCpfChange, clientName, cpfPending,
        handleClose, handleCpfSearch, form, subtmitStay, stayPending
    }


} 