import { axiosService } from "@/lib/axios";

export const clientService = {
    createNewClient: async (data: ClientRequest) => {
        const response = await axiosService.post("/clients", data)
        return response.data
    },
    findByCpf: async (cpf: string) => {
        const response = await axiosService.get(`/clients/${cpf}`)
        return response.data
    },
    findAllActiveClients: async () => {
        const response = await axiosService.get("/clients")
        return response.data
    },
    updateClient: async (data: ClientUpdate) => {
        const response = await axiosService.put("/clients", data)
        return response.data
    }
}

export type ClientRequest = {
    firstName: string
    lastName: string
    cpf: string
    cnpj?: string
    phoneNumber: string
    addresses: Address[]
}

export type Address = {
    zipCode: string
    street: string
    number: string
    state: string
    city: string
}

export type ClientResponse = {
    id: number
    firstName: string
    lastName: string
}

export type ClientUpdate = {
    id: number
    firstName: string
    lastName: string
    phoneNumber: string
}