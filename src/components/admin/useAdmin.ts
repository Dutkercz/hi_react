import { adminService } from "@/api/admin"
import { useQuery } from "@tanstack/react-query"

export const useAdmin = (year: number, month: number) => {

    const {data, isLoading, isError} = useQuery({
        queryKey: ["admin-data", year, month],
        queryFn: () => adminService.monthResume(year, month) 
    })

    return {data, isLoading, isError}
}