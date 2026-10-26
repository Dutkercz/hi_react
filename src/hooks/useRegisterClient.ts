import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { clientService } from "@/service/client"
import type { ClientRequest } from "@/types/client"
import { registerClientSchema } from "../schemas/clientRequestSchema"
import type { CepResponseData } from "@/types/cep"
import { cepService } from "@/service/cep"


export type UserRegisterClientProps = {
    index: number
}

export const useRegisterClient = ({ index }: UserRegisterClientProps) => {
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


    const findCepMutation = useMutation({
        mutationKey: ['cep'],
        mutationFn: (cep: string) => cepService.findCep(cep),
        onSuccess: (data: CepResponseData) => {
            form.setValue(`addresses.${index}.zipCode`, data.zipCode ?? "")
            form.setValue(`addresses.${index}.street`, data.street ?? "")
            form.setValue(`addresses.${index}.city`, data.city ?? "")
            form.setValue(`addresses.${index}.state`, data.state ?? "")
        }
    })

    const handleFindCep = () => {
        const cep = form.getValues().addresses[index].zipCode
        if (cep) {
            findCepMutation.mutate(cep)
        }
    }

    return { form, onSubmit, handleFindCep }
}