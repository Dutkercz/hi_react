import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserRound, Upload } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/useUser"
import { userService } from "@/service/user"
import SpinnerComp from "@/components/spinner/Spinner"
import { Field, FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"

const MyAccountPage = () => {
  const user = useUser()
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const currentImage = useQuery({
    queryKey: ["user-img", user.data?.email],
    queryFn: userService.getImg,
    enabled: Boolean(user.data),
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

  const userData = user.data
  const displayedImage = previewUrl ?? currentImage.data
  const roleLabel = userData?.role === "ADMIN" ? "Administrador" : "Usuário"

  return (
    <Card className="mx-auto w-full max-w-4xl p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Minha conta</CardTitle>
        <CardDescription>Consulte seus dados e gerencie sua imagem de perfil.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {user.isLoading ? (
          <SpinnerComp />
        ) : userData ? (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div className="flex size-42 items-center justify-center overflow-hidden rounded-full bg-muted">
                {displayedImage ? (
                  <img
                    src={displayedImage}
                    alt={`Imagem de perfil de ${userData.fullName}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound aria-hidden="true" className="size-12 text-muted-foreground" />
                )}
              </div>
              <input
                id="profile-image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                size="sm"
                variant={image ? "default" : "outline"}
                disabled={uploadMutation.isPending}
                onClick={() => {
                  if (image) {
                    uploadMutation.mutate(image)
                    return
                  }
                  fileInputRef.current?.click()
                }}
              >
                <Upload aria-hidden="true" />
                {uploadMutation.isPending
                  ? "Enviando..."
                  : image
                    ? "Enviar imagem"
                    : currentImage.data
                      ? "Atualizar imagem"
                      : "Adicionar imagem"}
              </Button>
            </div>
            <FieldGroup className="grid gap-3">
              <div>
                <Field className="text-sm text-muted-foreground">Nome</Field>
                <Field className="font-medium">{userData.fullName}</Field>
              </div>
              <div>
                <Field className="text-sm text-muted-foreground">E-mail</Field>
                <Field className="font-medium">{userData.email}</Field>
              </div>
              <div>
                <Field className="text-sm text-muted-foreground">Perfil</Field>
                <Field className="font-medium">{roleLabel}</Field>
              </div>
            </FieldGroup>
          </div>
        ) : (
          <p className="text-sm text-destructive" role="alert">
            Não foi possível carregar as informações da sua conta.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default MyAccountPage