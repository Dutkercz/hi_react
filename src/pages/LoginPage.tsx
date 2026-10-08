import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { cn } from 'cn'
import { Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const LoginPage = ({ className, ...props }: React.ComponentProps<"div">) => {
  const navigate = useNavigate()
  const { form, isLogginIn, login } = useAuth()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Faça Login na sua conta</CardTitle>
          <CardDescription>
            Entre com seu email e senha abaixo.
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
              render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}  >
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Button variant="link" onClick={() => navigate("/", {replace: true})}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </Button>
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
                <Button disabled={isLogginIn} type="submit">Acessar</Button>
                <Button disabled={true} variant="outline" type="button">
                  Login with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage