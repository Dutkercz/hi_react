import { axiosService } from "@/lib/axios"

export const cepService = {
    findCep: async (cep: string) => {
        const response = await axiosService.get<CepResponseData>(`/cep/${cep}`)
        return response.data
    }
}

export type CepResponseData = {
    zipCode: string
    street: string
    city: string
    state: string
}