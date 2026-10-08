import { axiosService } from "@/service/axiosService"
import type { CepResponseData } from "@/types/cep"

export const cepService = {
    findCep: async (cep: string) => {
        const response = await axiosService.get<CepResponseData>(`/cep/${cep}`)
        return response.data
    }
}
