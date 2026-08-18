import { cepService, type CepResponseData } from "@/api/cep"
import type { ClientRequest } from "@/api/client"
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
import { useRegisterClientForm } from "@/forms/client/form"
import InputMask from "@react-input/mask/InputMask"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Controller } from "react-hook-form"

const RegisterPage = () => {
  const { form, onSubmit } = useRegisterClientForm()
  const [controlCheckBox, setControlCheckBox] = useState(false)

  const handleCheckBox = () => {
    setControlCheckBox((v) => !v)
  }

  const handleOnSubmit = (data: ClientRequest) => {
    onSubmit(data)
  }

  const findCepMutation = useMutation({
    mutationKey: ['cep'],
    mutationFn: (cep: string) => cepService.findCep(cep),
    onSuccess: (data: CepResponseData) => {
      form.setValue(`addresses.${0}.zipCode`, data.zipCode ?? "")
      form.setValue(`addresses.${0}.street`, data.street ?? "")
      form.setValue(`addresses.${0}.city`, data.city ?? "")
      form.setValue(`addresses.${0}.state`, data.state ?? "")
    }
  })

  const handleFindCep = () => {
    const cep = form.getValues().addresses[0].zipCode
    if (cep) {
      findCepMutation.mutate(cep)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">

      <div className="w-full max-w-xl p-4 bg-muted/60">
        <form onSubmit={form.handleSubmit(handleOnSubmit, (err) => console.log("Erros do Form:", err))}>
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

                <div className="grid grid-cols-2 gap-2">

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
                  <CardDescription className="flex-col col-span-2">
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
                <div className="grid grid-cols-2 items-center justify-center gap-4">

                  <div className="flex items-end justify-center col-span-2 gap-2 w-full">

                    <div className="flex-3">
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
                    <Button className="flex-2" onClick={handleFindCep}>
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