import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRecoveryPassword } from "@/hooks/useRecoveryPassword"
import { Controller } from "react-hook-form"

const RedefinePasswordPage = ({ ...props }: React.ComponentProps<typeof Card>) => {

  const { form, submitNewPassword, isLoading } = useRecoveryPassword()
  const otpCode = new URLSearchParams(window.location.search).get("token") || ""
  form.setValue("otpCode", otpCode)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">

        <Card {...props}>
          <CardHeader className="text-center">
            <CardTitle>Redefinir Senha</CardTitle>
            <CardDescription>
             cadastre sua nova senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(submitNewPassword)}>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password" data-invalid={fieldState.invalid}>
                      Nova senha
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="password"
                      type="password"
                      autoComplete="false"
                      required
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    <FieldDescription>
                      6 caracteres entre maiúsculos, minúsculos e números
                    </FieldDescription>
                  </Field>
                )}
              />

              <Controller
                name="confirmpw"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="confirmpw" data-invalid={fieldState.invalid}>
                      Repita sua nova senha
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="confirmpw"
                      type="password"
                      autoComplete="false"
                      required
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <FieldGroup>
                <Field>
                  <Button disabled={isLoading} type="submit">Cadastrar</Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RedefinePasswordPage