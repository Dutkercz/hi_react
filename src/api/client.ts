import { axiosService } from "@/lib/axios"

export const clientService = {
    createNewClient: async (data: ClientRequest): Promise<ClientResponse[]> => {
        const response = await axiosService.post("/clients", data)
        return response.data
    },
    findByCpf: async (cpf : string) => {
        try{
            const response = await axiosService.get(`/clients/${cpf}`)
            return response.data
        }catch(error){
            console.log(error);
        }
    },
    findAllActiveClients: async () => {
        const response = await axiosService.get("/clients")
        return response.data
    }
}

export type ClientRequest = {
    firstName: string
    lastName: string
    cpf: string
    cnpj?: string
    phoneNumber : string
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