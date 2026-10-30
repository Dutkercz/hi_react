import type { ClientResponse } from "@/types/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Eye, UserRound } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { clientService } from "@/service/client"

type SearchResultCardProps = {
  res: ClientResponse
}

export const SearchResultCard = ({ res }: SearchResultCardProps) => {

  const [open, setOpen] = useState(false)

  const userDetail = useQuery({
    queryKey : ["userDetail"],
    queryFn: () => {
      return clientService.clientDetails(res.id)
    },
    enabled: open,
    
  })

  //const handleOpenView = () => {
//      setOpen((v) => !v)
  //}


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
      <div className="m-auto">
        <p className="text-muted-foreground">
          Data de cadastro {res.createdAt}
        </p>
      </div>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button onClick={() => setOpen((v) => !v)}><Eye /></Button>
          } />
          <DialogContent>

          {/** MOVE CONTENT TO CUSTOM CARD */}

             <Card className='h-full border-border/70 shadow-sm' key={res.id}>
              <CardHeader>
                <CardTitle>Informações de Cliente</CardTitle>
              </CardHeader>
              <div className="w-full">
                <CardContent className="w-full">
                  <CardTitle>Nome <CardDescription>{userDetail.data?.firstName}</CardDescription></CardTitle>
                  <span>{userDetail.data?.status}</span>
                </CardContent>

              </div>
            </Card>

            {/** END CONTENT */}

          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  )
}
