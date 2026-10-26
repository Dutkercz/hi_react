import SpinnerComp from "@/components/spinner/Spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, UserRound } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useSearchPage } from "@/hooks/useSearchPage"

const SearchPage = () => {
  const {search, setSearch, debouncedSearch, results, isError, isLoading} = useSearchPage()

  return (
    <Card className='min-h-screen bg-background'>
      <div className="bg-muted p-2">
        <CardHeader className="text-center p-2 m-1 bg-muted">
          <CardTitle>Consulta de Informações</CardTitle>
          <CardDescription>Acesse Informações de histórico e cadastro de hóspedes.</CardDescription>
        </CardHeader>
        <Separator className="mb-4"/>
        <CardContent className="flex gap-2 m-2">
          <Label htmlFor="search-input"><CardDescription>Busque por Nome, CPF ou CNPJ</CardDescription></Label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-full pl-8 border"
              id="search-input"
              placeholder="Digite aqui..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>

        <div className="mx-2 mb-4 rounded-xl border bg-muted/20 p-3 sm:mx-4 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <CardTitle>Resultados</CardTitle>
            {results && !isError && (
              <Badge variant="secondary">
                {results.length} {results.length === 1 ? "resultado" : "resultados"}
              </Badge>
            )}
          </div>

          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {isLoading && debouncedSearch.trim().length > 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border bg-background px-4 py-6 text-center">
                <SpinnerComp />
                <CardDescription>Buscando clientes...</CardDescription>
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
                Erro ao buscar informações. Tente novamente.
              </div>
            ) : results && results.length > 0 ? (
              results.map((res) => (
                <CardContent
                  key={res.id}
                  className="flex min-w-0 items-center gap-3 rounded-lg border p-3 shadow-sm transition-colors hover:bg-muted/40 sm:px-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound aria-hidden="true" className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="wrap-break-word font-medium text-foreground">
                      {res.firstName} {res.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Data de cadastro {res.createdAt}
                    </p>
                  </div>
                </CardContent>
              ))
            ) : debouncedSearch.trim().length > 0 ? (
              <div className="rounded-lg border px-4 py-6 text-center">
                <CardDescription>Não encontrei resultados para sua busca.</CardDescription>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed px-4 py-6 text-center">
                <Search aria-hidden="true" className="mx-auto mb-2 size-5 text-muted-foreground" />
                <CardDescription>Digite um nome, CPF ou CNPJ para consultar os clientes.</CardDescription>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default SearchPage
