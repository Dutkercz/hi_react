import { dailyPricesUpdateSchema } from "@/schemas/dailyPricesUpdateSchema"
import { adminService } from "@/service/admin"
import type { DailyPricesUpdate } from "@/types/admin"
import type { BackendError } from "@/types/backendError"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const useDailyPricesUpdate = () => {
    const queryClient = useQueryClient()

    const { data: lastDailyPrice, isLoading } = useQuery({
        queryKey: ["daily-prices"],
        queryFn: () => adminService.getDailyPrices(),
    })
    

    const form = useForm({
        resolver: zodResolver(dailyPricesUpdateSchema),
        values: {
            id: lastDailyPrice?.id,
            oneGuestPrice: lastDailyPrice?.oneGuestPrice,
            twoGuestPrice: lastDailyPrice?.twoGuestPrice,
            threeGuestPrice: lastDailyPrice?.threeGuestPrice,
            fourGuestPrice: lastDailyPrice?.fourGuestPrice
        }
    })

    const updatePricesMutation = useMutation({
        mutationFn: (data: DailyPricesUpdate) => adminService.updateDailyPrices(data),
        onSuccess:() => {
            toast.success("Tabela de preços atualizada com sucesso!")
            queryClient.invalidateQueries({queryKey: ["daily-prices"]})
        },
        onError: (error : AxiosError<BackendError>) => {
            toast.error("Erro ao atualizar a tabela de precços: " + error.response?.data.detail)
        }
    })

    const onSubmit = (data : DailyPricesUpdate) => {
        updatePricesMutation.mutate(data)
    }

    const isUpdataLoading = updatePricesMutation.isPending

    return {form, onSubmit, isUpdataLoading, isLoading, lastDailyPrice}
}