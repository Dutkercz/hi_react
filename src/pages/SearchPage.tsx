import SpinnerComp from "@/components/spinner/Spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminService } from "@/service/admin"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useDebounce } from 'use-debounce';


const SearchPage = () => {
  const [search, setSearch] = useState("")

  const [debouncedSearch] = useDebounce(search, 500)

  const { data: results, isLoading } = useQuery({
    queryKey: [debouncedSearch],
    queryFn: () => {
      return adminService.infoSearch(debouncedSearch)
    },
    enabled: debouncedSearch.length > 3
  })

  return (
    <Card className='min-h-screen'>
      <div>
        <CardHeader className="text-center">
          <CardTitle>
            Consulta de Informações
          </CardTitle>
          <CardDescription>
            Acesse Informações de histórico e cadastro de hospedes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="mb-2" htmlFor="search-input">Busque por nome, CPF ou CNPJ</Label>
          <Input className="w-auto"
            id="search-input"
            placeholder="Digite aqui..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
        <div className="border bg-background m-2 max-h-screen">
          {isLoading && debouncedSearch.length > 0 && <SpinnerComp />}
          {results && results.length > 0 ? (
            results.map((res) => (
              <div key={res.id}>
                {res.firstName +" "+ res.lastName}
              </div>
            ))
          )
          :
          (
            results && results?.length === 0 &&
            <div>
                <CardDescription>Não encontrei resultados para sua busca</CardDescription>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default SearchPage
