import { axiosService } from "@/lib/axios"

export const clientService = {
    createNewClient: async (data: ClientRequest): Promise<ClientResponse[]> => {
        const response = await axiosService.post("/clients", data)
        return response.data
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
}

export type ClientResponse = {
    id: number
    firstName: string
    lastName: string
}