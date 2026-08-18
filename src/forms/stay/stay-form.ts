import type { StayRequest } from "@/api/stay"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { staySchema } from "./stay-schema"

export const useStayRequestForm = (id: number) => {
    return useForm<StayRequest>({
        resolver: zodResolver(staySchema),
        defaultValues: {
            clientId: undefined,
            roomId: id,
            checkIn: "",
            checkOut: "",
            totalGuests: 1,
            isPaid: false,
            stayGuests: [],
        },
        shouldUnregister: true,
        mode: "onBlur"
    })
} 