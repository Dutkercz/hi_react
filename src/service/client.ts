import { axiosService } from "@/service/axiosService";
import type { ClientDetails, ClientRequest, ClientResponse, ClientUpdate } from "@/types/client";

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
    },
    clientDetails: async (id: number) => {
        const response = await axiosService.get<ClientDetails>(`/clients/details/${id}`)
        return response.data
    },
    infoSearch : async (param : string) => {
        const response = await axiosService.get<ClientResponse[]>(`/clients/search?param=${param}`)
        return response.data
    }
}
