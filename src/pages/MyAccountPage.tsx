import { UserRound, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/useUser"
import SpinnerComp from "@/components/spinner/Spinner"
import { Field, FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useMyAccountPage } from "@/hooks/useMyAccountPage"

const MyAccountPage = () => {
  const user = useUser()
  const {fileInputRef, ...data } = useMyAccountPage({user: user.data})
  
  const userData = user.data
  
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
                {data.displayedImage ? (
                  <img
                    src={data.displayedImage}
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
                onChange={data.handleImageChange}
              />
              <Button
                type="button"
                size="sm"
                variant={data.image ? "default" : "outline"}
                disabled={data.uploadMutation.isPending}
                onClick={() => {
                  if (data.image) {
                    data.uploadMutation.mutate(data.image)
                    return
                  }
                  fileInputRef.current?.click()
                }}
              >
                <Upload aria-hidden="true" />
                {data.uploadMutation.isPending
                  ? "Enviando..."
                  : data.image
                    ? "Enviar imagem"
                    : data.currentImage.data
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