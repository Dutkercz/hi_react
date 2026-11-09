import type { ClientResponse } from "@/types/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Eye, UserRound } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { clientService } from "@/service/client"
import { Badge } from "../ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { useFormatCurrency } from "@/hooks/useFormatCurrency"

type SearchResultCardProps = {
  res: ClientResponse
}

export const SearchResultCard = ({ res }: SearchResultCardProps) => {
  const format = useFormatCurrency()
  const [open, setOpen] = useState(false)

  const stayStatus = {
    CURRENT: "Em andamento",
    CANCELED: "Cancelada",
    FINISHED: "Finalizada"
  } as const

  const clientStatus = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo"
  } as const

  const userDetail = useQuery({
    queryKey: ["userDetail"],
    queryFn: () => {
      return clientService.clientDetails(res.id)
    },
    enabled: open,
  })

  const latestStays = userDetail.data?.stays
    .slice()
    .sort((firstStay, secondStay) =>
      new Date(secondStay.checkIn).getTime() - new Date(firstStay.checkIn).getTime()
    )
    .slice(0, 10) ?? []

  return (
    <CardContent
      key={res.id}
      className="flex min-w-0 items-center gap-3 rounded-lg border p-3 shadow-sm transition-colors hover:bg-muted/40 sm:px-4"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UserRound aria-hidden="true" className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="block md:hidden font-medium text-foreground">
          {res.firstName} {res.lastName.split(" ")[0]}
        </p>
        <p className="hidden md:block font-medium text-foreground">
          {res.firstName} {res.lastName}
        </p>
      </div>
      <div className="ml-auto">
        <p className="text-muted-foreground">
          Data de cadastro {res.createdAt}
        </p>
      </div>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button aria-label={`Ver detalhes de ${res.firstName} ${res.lastName}`}>
              <Eye />
            </Button>
          } />
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <div className="space-y-6">
              <Card className="border-border/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Informações do cliente</CardTitle>
                  <CardDescription>
                    Dados cadastrais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">
                      {userDetail.data
                        ? `${userDetail.data.firstName} ${userDetail.data.lastName}`
                        : "—"}
                    </p>
                  </div>
                  {userDetail.data?.cnpj &&
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">CNPJ</p>
                      <p className="font-medium">
                        {userDetail.data?.cnpj || userDetail.data?.idClient || "—"}
                      </p>
                    </div>
                  }
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">
                      {userDetail.data?.phoneNumber || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline">{userDetail.data?.status? clientStatus[userDetail.data.status] : "-" }</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cadastro</p>
                    <p className="font-medium">
                      {userDetail.data?.createdAt
                        ? userDetail.data.createdAt
                        : "—"}
                    </p>
                  </div>
                  <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium">
                      {userDetail.data?.addresses[0]
                        ? `${userDetail.data.addresses[0].street}, ${userDetail.data.addresses[0].number} - ${userDetail.data.addresses[0].city}/${userDetail.data.addresses[0].state}`
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Histórico de diárias</CardTitle>
                  <CardDescription>
                    Últimas 10 diárias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Saída</TableHead>
                        <TableHead>Apartamento</TableHead>
                        <TableHead>Diárias</TableHead>
                        <TableHead>Valor total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pagamento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestStays.length > 0 ? (
                        latestStays.map((stay) => (
                          <TableRow key={stay.id}>
                            <TableCell>
                              {new Date(stay.checkIn).toLocaleDateString("pt-br")}
                            </TableCell>
                            <TableCell>
                              {new Date(stay.checkOut).toLocaleDateString("pt-br")}
                            </TableCell>
                            <TableCell>{stay.room?.roomNumber ?? "—"}</TableCell>
                            <TableCell>{stay.dailyRates}</TableCell>
                            <TableCell>
                              {format(stay.totalPrice)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{stayStatus[stay.stayStatus]}</Badge>
                            </TableCell>
                            <TableCell>{stay.isPaid ? "Pago" : "Pendente"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-24 text-center text-muted-foreground"
                          >
                            Nenhuma diária para exibir.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  )
}
