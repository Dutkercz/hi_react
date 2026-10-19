import { dailyPricesUpdateSchema, type DailyPricesUpdateSchema } from "@/schemas/dailyPricesUpdateSchema"
import { adminService } from "@/service/admin"
import type { DailyPricesUpdate } from "@/types/admin"
import type { BackendError } from "@/types/backendError"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useFormatCurrency } from "./useFormatCurrency"

export const useDailyPricesUpdate = () => {
    const queryClient = useQueryClient()
    const format = useFormatCurrency()

    const { data: lastDailyPrice, isLoading } = useQuery({
        queryKey: ["daily-prices"],
        queryFn: () => adminService.getDailyPrices(),
    })
    

    const form = useForm({
        resolver: zodResolver(dailyPricesUpdateSchema),
        values: {
            id: lastDailyPrice?.id,
            oneGuestPrice: format(lastDailyPrice?.oneGuestPrice ?? 0),
            twoGuestPrice: format(lastDailyPrice?.twoGuestPrice ?? 0),
            threeGuestPrice: format(lastDailyPrice?.threeGuestPrice ?? 0),
            fourGuestPrice: format(lastDailyPrice?.fourGuestPrice ?? 0)
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

    const onSubmit = (data: DailyPricesUpdateSchema) => {
        updatePricesMutation.mutate({
            ...data,
            oneGuestPrice: data.oneGuestPrice / 100,
            twoGuestPrice: data.twoGuestPrice / 100,
            threeGuestPrice: data.threeGuestPrice / 100,
            fourGuestPrice: data.fourGuestPrice / 100
        })
    }

    const isUpdataLoading = updatePricesMutation.isPending

    return {form, onSubmit, isUpdataLoading, isLoading, lastDailyPrice}
}