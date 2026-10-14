import { userService } from "@/service/user"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "./useAuth"

export const useUser = () => {
    const { isLogged, isLoading } = useAuth()
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            if(!isLoading && isLogged){
                return userService.me()
            }
        },
        enabled: isLogged
    })
}