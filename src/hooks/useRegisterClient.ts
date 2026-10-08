import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { updateClientSchema } from "../schemas/clientUpdateSchema"
import { clientService } from "@/service/client"
import type { ClientRequest, ClientResponse, ClientUpdate } from "@/types/client"
import { registerClientSchema } from "../schemas/clientRequestSchema"

export const useRegisterClientForm = () => {
    const form = useForm<ClientRequest>({
        resolver: zodResolver(registerClientSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            cpf: "",
            cnpj: "",
            phoneNumber: "",
            addresses: [{ zipCode: "", street: "", number: "", city: "", state: "" }]
        }
    })

    const navigate = useNavigate()

    const registerMutation = useMutation({
        mutationKey: ["clients"],
        mutationFn: (data: ClientRequest) => clientService.createNewClient(data),
        onSuccess: () => {
            toast.success("Cliente cadastrado com sucesso!")
            form.reset()
            navigate("/")
        }
    })

    const onSubmit = (data: ClientRequest) => {
        registerMutation.mutate(data)
    }

    return { form, onSubmit }
}

export const useUpdateClientForm = (client: ClientResponse) => {
    const form = useForm<ClientUpdate>({
        resolver: zodResolver(updateClientSchema),
        defaultValues: {
            id: client.id,
            firstName: client.firstName ?? "",
            lastName: client.lastName ?? "",
        },
        shouldUnregister: true

    })

    const queryClient = useQueryClient()

    const updateMutation = useMutation({
        mutationKey: ["clients"],
        mutationFn: (client: ClientUpdate) => clientService.updateClient(client),
        onSuccess: () => {
            toast.success("Cliente cadastrado com sucesso!")
            form.reset()
            queryClient.invalidateQueries({ queryKey: ["clients"] })
        }
    })

    const submit = (client: ClientUpdate) => {
        updateMutation.mutate(client)
    }

    return { form, submit }
}