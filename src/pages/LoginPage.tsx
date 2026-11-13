import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { cn } from 'cn'
import { useState, type BaseSyntheticEvent } from 'react'
import { Controller } from 'react-hook-form'
import { Navigate } from 'react-router-dom'

const LoginPage = ({ className, ...props }: React.ComponentProps<"div">) => {
  //const navigate = useNavigate()
  const { form, isLoading, login, isLogged, recoveryPwEmail } = useAuth()
  const [email, setEmail] = useState("")
  const [sendMailModal, openSendMailModal] = useState(false)

  if (isLogged) return <Navigate to="/" replace={true} />

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-xl p-4 bg-muted/60">
          <Card >
            <CardHeader className='text-center'>
              <CardTitle>Faça Login na sua conta</CardTitle>
              <CardDescription>
                Entre com seu email e senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(login)}>
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name='username'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="username">Email</FieldLabel>
                        <Input
                          {...field}
                          id="username"
                          type="email"
                          placeholder="email@example.com"
                          aria-invalid={fieldState.invalid}
                          autoComplete="false"
                          required
                        />
                      </Field>
                    )
                    }
                  />
                  <Controller
                    control={form.control}
                    name='password'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}  >
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">Senha</FieldLabel>
                          <Dialog open={sendMailModal} onOpenChange={openSendMailModal}>
                            <DialogTrigger
                              render={<Button
                                variant='link'
                                className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                              >Esqueceu a senha?</Button>}
                            />
                            <DialogContent className=''
                            >
                              <CardHeader>
                                <CardTitle>Recuperação de senha</CardTitle>
                                <CardDescription>
                                  Enviaremos os detalhes para o seu email.
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-col gap-6">
                                  <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                      id="email"
                                      value={email}
                                      onChange={(e: BaseSyntheticEvent) => setEmail(e.target.value)}
                                      type="email"
                                      placeholder="mail@example.com"
                                      required
                                    />
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex-col gap-2">
                                <Button type="button" disabled={isLoading || !email}
                                  onClick={() => {
                                    recoveryPwEmail(email)
                                    setEmail("")
                                    openSendMailModal(false)
                                  }}
                                  className="w-full">
                                  Enviar
                                </Button>
                              </CardFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          aria-invalid={fieldState.invalid}
                          autoComplete='false'
                          required />
                      </Field>
                    )}

                  />
                  <Field>
                    <Button disabled={isLoading} type="submit">Acessar</Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage