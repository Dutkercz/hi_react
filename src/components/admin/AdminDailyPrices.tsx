import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldError } from "../ui/field"
import { Input } from "../ui/input"
import InputNumberFormat from "@react-input/number-format/InputNumberFormat"
import { useDailyPricesUpdate } from "@/hooks/useDailyPricesUpdate"
import SpinnerComp from "../spinner/Spinner"
import { Controller } from "react-hook-form"
import { Button } from "../ui/button"
import { useFormatCurrency } from "@/hooks/useFormatCurrency"

const AdminDailyPrices =  () => {
  
  const { form, onSubmit, isUpdataLoading, isLoading, lastDailyPrice } = useDailyPricesUpdate();
  const format = useFormatCurrency()
  if (isLoading) return <SpinnerComp />

  return (
    <div>
      <CardHeader className="text-center">
        <CardTitle>Tabela de Preços</CardTitle>
        <CardDescription>Visualize ou altere a tabela de preços atual</CardDescription>
      </CardHeader>
      <div className="mt-2 ">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className='grid grid-cols-1 gap-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4'>
            <span hidden={true} defaultValue={lastDailyPrice?.id} />

            <CardContent className="text-center">
              <CardTitle>Diária</CardTitle>
              <CardDescription>
                1 Pessoa
              </CardDescription>
              <Controller
                control={form.control}
                name="oneGuestPrice"
                render={({ field, fieldState }) => (
                  <Field className="border p-2 rounded-lg bg-muted">
                    <label
                      htmlFor="oneGuestPrice"
                      data-invalid={fieldState.invalid}
                      className="text-sm font-medium">
                      Novo valor
                    </label>
                    <InputNumberFormat
                      {...field}
                      value={format(field.value as string | number | undefined)}
                      aria-invalid={fieldState.invalid}
                      id="oneGuestPrice"
                      component={Input}
                      locales="pt-BR"
                      format="currency"
                      currency="BRL"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
            </CardContent>

            <CardContent className="text-center">
              <CardTitle>Diária</CardTitle>
              <CardDescription>
                2 Pessoas
              </CardDescription>
              <Controller
                control={form.control}
                name="twoGuestPrice"
                render={({ field, fieldState }) => (
                  <Field className="border p-2 rounded-lg bg-muted">
                    <label
                      htmlFor="twoGuestPrice"
                      data-invalid={fieldState.invalid}
                      className="text-sm font-medium">
                      Novo valor
                    </label>
                    <InputNumberFormat
                      {...field}
                      value={format(field.value as string | number | undefined)}
                      aria-invalid={fieldState.invalid}
                      id="twoGuestPrice"
                      component={Input}
                      locales="pt-BR"
                      format="currency"
                      currency="BRL"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
            </CardContent>

            <CardContent className="text-center">
              <CardTitle>Diária</CardTitle>
              <CardDescription>3 Pessoas</CardDescription>
              <Controller
                control={form.control}
                name="threeGuestPrice"
                render={({ field, fieldState }) => (
                  <Field className="border p-2 rounded-lg bg-muted">
                    <label
                      htmlFor="threeGuestPrice"
                      data-invalid={fieldState.invalid}
                      className="text-sm font-medium">
                      Novo valor
                    </label>
                    <InputNumberFormat
                      {...field}
                      value={format(field.value as string | number | undefined)}
                      aria-invalid={fieldState.invalid}
                      id="threeGuestPrice"
                      component={Input}
                      locales="pt-BR"
                      format="currency"
                      currency="BRL"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
            </CardContent>

            <CardContent className="text-center">
              <CardTitle>Diária</CardTitle>
              <CardDescription>4 Pessoas</CardDescription>
              <Controller
                control={form.control}
                name="fourGuestPrice"
                render={({ field, fieldState }) => (
                  <Field className="border p-2 rounded-lg bg-muted">
                    <label
                      htmlFor="fourGuestPrice"
                      data-invalid={fieldState.invalid}
                      className="text-sm font-medium">
                      Novo valor
                    </label>
                    <InputNumberFormat
                      {...field}
                      value={format(field.value as string | number | undefined)}
                      aria-invalid={fieldState.invalid}
                      id="fourGuestPrice"
                      component={Input}
                      locales="pt-BR"
                      format="currency"
                      currency="BRL"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
            </CardContent>
            <CardFooter className="col-span-full flex items-center justify-center">
              <Button disabled={isUpdataLoading} type="submit" size="lg">
                Salvar Novos valores
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>

    </div >
  )
}


export default AdminDailyPrices