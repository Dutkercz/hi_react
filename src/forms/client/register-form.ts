import { clientService, type ClientRequest } from "@/api/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { registerClinetSchema } from "./register-schema"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useRegisterClientForm = () => {
    const form = useForm<ClientRequest>({
        resolver: zodResolver(registerClinetSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            cpf: "",
            cnpj: "",
            phoneNumber: "",
            addresses:[{zipCode: "", street: "", number: "", city: "", state: ""}] 
        }
    })

    const navigate = useNavigate()

    const registerMutation = useMutation({
        mutationKey: ["clients"],
        mutationFn: (data : ClientRequest) => clientService.createNewClient(data),
        onSuccess: () => {
            toast.success("Cliente cadastrado com sucesso!")
            form.reset()
            navigate("/")
        }
    })

    const onSubmit = (data: ClientRequest) => {
        registerMutation.mutate(data)
    }

    return {form, onSubmit}
}