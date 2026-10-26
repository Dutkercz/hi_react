import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRegisterClient } from "@/hooks/useRegisterClient"
import InputMask from "@react-input/mask/InputMask"
import { useState } from "react"
import { Controller } from "react-hook-form"

const RegisterPage = () => {
  const { form, onSubmit, handleFindCep } = useRegisterClient({ index: 0 })
  const [controlCheckBox, setControlCheckBox] = useState(false)

  const handleCheckBox = () => {
    setControlCheckBox((v) => !v)
  }

  return (
    <div className="flex min-h-screen w-full items-start justify-center p-3 sm:items-center sm:p-4">

      <div className="w-full max-w-xl rounded-xl bg-muted/60 p-4 shadow-sm sm:p-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup >
            <FieldSet>
              <FieldLegend className="text-center">Cadastro de Clientes</FieldLegend>
              <FieldDescription className="text-center">
                Insira os dados abaixo para cadastrar um novo cliente
              </FieldDescription>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">
                        * Nome
                      </FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        placeholder="Ex.: Álvaro"
                        aria-invalid={fieldState.invalid}
                        autoComplete="false"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )} />

                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <Field data-ivalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastName">
                        * Sobrenome
                      </FieldLabel>
                      <Input
                        {...field}
                        id="lastName"
                        aria-invalid={fieldState.invalid}
                        placeholder="Ex.: Monteiro"
                        autoComplete="false"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )} />

                <Controller
                  control={form.control}
                  name="phoneNumber"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phoneNumber">
                        * Telefone
                      </FieldLabel>
                      <InputMask
                        component={Input}
                        mask="(__)-_____-____"
                        replacement={{ _: /\d/ }}
                        {...field}
                        id="phoneNumber"
                        placeholder="53 - *****-****"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )} />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">

                  <Controller
                    control={form.control}
                    name="cpf"
                    render={({ field, fieldState }) => (
                      <Field data-ivalid={fieldState.invalid}>
                        <FieldLabel htmlFor="cpf">
                          * CPF
                        </FieldLabel>
                        <InputMask
                          {...field}
                          id="cpf"
                          aria-invalid={fieldState.invalid}
                          replacement={{ _: /\d/ }}
                          mask="___.___.___-__"
                          placeholder="000.000.000-00"
                          component={Input} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )} />

                  <Controller
                    control={form.control}
                    name="cnpj"
                    render={({ field, fieldState }) => (
                      <Field data-ivalid={fieldState.invalid}>
                        <FieldLabel htmlFor="cnpj">
                          CNPJ
                          <Checkbox onClick={handleCheckBox} />
                          <FieldDescription><i>(habilitar cnpj)</i></FieldDescription>
                        </FieldLabel>
                        <InputMask
                          disabled={!controlCheckBox}
                          {...field}
                          id="cnpj"
                          aria-invalid={fieldState.invalid}
                          replacement={{ _: /\d/ }}
                          mask="__.___.___/____-__"
                          placeholder="00.000.000-0000/00"
                          component={Input} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )} />
                  <CardDescription className="flex-col sm:col-span-2">
                    <i>campos marcados com * são obrigatórios</i>
                  </CardDescription>
                </div>


              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend className="text-center">Informações de Endereço</FieldLegend>
              <FieldDescription className="text-center">
                <i>não obrigatórias</i>
              </FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2">

                  <div className="col-span-full flex w-full items-end justify-center gap-2">

                    <div className="min-w-0 flex-1">
                      <Controller
                        control={form.control}
                        name={`addresses.${0}.zipCode`}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="zipCode">CEP</FieldLabel>
                            <InputMask
                              {...field}
                              component={Input}
                              mask="_____-___"
                              replacement={{ _: /\d/ }}
                              placeholder="00000-000" />
                          </Field>
                        )}
                      />
                    </div>
                    <Button className="shrink-0" type="button" onClick={handleFindCep}>
                      Buscar
                    </Button>
                  </div>

                  <Controller
                    control={form.control}
                    name={`addresses.${0}.street`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`addresses.${0}.street`}>
                          Rua
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`addresses.${0}.street`}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )} />

                  <Controller
                    control={form.control}
                    name={`addresses.${0}.number`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`addresses.${0}.number`}>
                          Número
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`addresses.${0}.number`}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )} />

                  <Controller
                    control={form.control}
                    name={`addresses.${0}.city`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`addresses.${0}.city`}>
                          Cidade
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`addresses.${0}.city`}
                          disabled={true}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )} />

                  <Controller
                    control={form.control}
                    name={`addresses.${0}.state`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`addresses.${0}.state`}>
                          Estado
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`addresses.${0}.state`}
                          disabled={true}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )} />

                </div>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage