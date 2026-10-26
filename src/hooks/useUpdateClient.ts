import { updateClientSchema } from "@/schemas/clientUpdateSchema"
import { clientService } from "@/service/client"
import type { ClientResponse, ClientUpdate } from "@/types/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const useUpdateClient = (client: ClientResponse) => {
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
            toast.success("Cliente atualizado com sucesso!")
            form.reset()
            queryClient.invalidateQueries({ queryKey: ["clients"] })
        }
    })

    const submit = (client: ClientUpdate) => {
        updateMutation.mutate(client)
    }

    return { form, submit }
}