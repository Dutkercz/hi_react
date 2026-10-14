import type { UserRequest, UserResponse } from "@/types/user"
import { axiosService } from "./axiosService"

export const userService = {
    me: async () : Promise<UserResponse> => {
        const response = await axiosService.get("/users")
        return response.data 
    },
    uploadImage: async (image: File) => {
        const formData = new FormData()
        formData.append("file", image)

        const response = await axiosService.post("/users/updaload-img", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data
    },
    getImg: async () => {
        const response = await axiosService.get("/users/download-img", {
            responseType: 'blob'
          });
          return URL.createObjectURL(response.data)
    },
    registerUser: async (data: UserRequest) : Promise<UserResponse> => {
        const response = await axiosService.post<UserResponse>("/users", data, {
            withCredentials: true
        })
        return response.data
    }
}