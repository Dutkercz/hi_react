import type { ClientResponse } from "@/types/client"
import { CardContent } from "../ui/card"
import { UserRound } from "lucide-react"

type SearchResultCardProps = {
    res: ClientResponse
}

export const SearchResultCard = ({ res }: SearchResultCardProps) => {
    return (
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
    )
}
