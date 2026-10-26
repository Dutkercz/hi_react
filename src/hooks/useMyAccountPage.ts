import { userService } from "@/service/user"
import type { UserResponse } from "@/types/user"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { useState, useRef, useEffect, type ChangeEvent } from "react"
import { toast } from "sonner"

type UseMyAccountPageProps = {
    user : UserResponse | undefined
}

export const useMyAccountPage = ({ user }: UseMyAccountPageProps) => {
    const [image, setImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    const currentImage = useQuery({
        queryKey: ["user-img", user?.email],
        queryFn: userService.getImg,
        enabled: Boolean(user),
        staleTime: Infinity,
        retry: false
    })

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    const uploadMutation = useMutation({
        mutationFn: userService.uploadImage,
        onSuccess: async () => {
            setImage(null)
            setPreviewUrl(null)
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["user"] }),
                queryClient.invalidateQueries({ queryKey: ["user-img"] })
            ])
            toast.success("Imagem enviada com sucesso.")
        },
        onError: () => {
            toast.error("Não foi possível enviar a imagem. Tente novamente.")
        }
    })

    const selectImage = (file?: File) => {
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error("Selecione um arquivo de imagem.")
            return
        }

        setImage(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        selectImage(event.target.files?.[0])
        event.target.value = ""
    }

    const displayedImage = previewUrl ?? currentImage.data

    return {image, currentImage, fileInputRef, uploadMutation, handleImageChange, displayedImage}
}