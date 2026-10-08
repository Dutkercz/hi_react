import { axiosService } from "@/service/axiosService"
import type { RoomResponse, RoomUpdateRequest } from "@/types/room"

export const roomService = {
    getAll: async (): Promise<RoomResponse[]> => {
        const response = await axiosService.get("/rooms")
        return response.data
    },
    updateRoomConfig: async (id: number, room: RoomUpdateRequest) => {
        const response = await axiosService.patch(`/rooms/${id}`, room)
        return response.data
    }
}
