import type { RoomResponse } from "@/types/room"
import { BedDoubleIcon, BedSingle, UserRoundIcon } from "lucide-react"
import { Card, CardDescription } from "../ui/card"

type SimpleRoomCardProps = {
  room: RoomResponse
}

const SimpleRoomCard = ({ room }: SimpleRoomCardProps) => {
  const clientName = room.stay?.client
    ? `${room.stay.client.firstName} ${room.stay.client.lastName.split(" ")[0]}`
    : null

  const roomStatusLabel = {
    AVAILABLE: "Disponível",
    OCCUPIED: "Ocupado",
    MAINTENANCE: "Manutenção",
    RESERVED: "Reservado",
  } as const

  const roomStatusClasses = {
    AVAILABLE: "bg-emerald-500/10 text-emerald-700",
    OCCUPIED: "bg-sky-500/10 text-sky-700",
    MAINTENANCE: "bg-amber-500/10 text-amber-700",
    RESERVED: "bg-violet-500/10 text-violet-700",
  } as const

  return (
    <Card className="h-full w-full gap-0 border-border/70 p-4 text-left shadow-sm transition-shadow group-hover/card:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Apartamento</p>
          <p className="truncate text-2xl font-semibold">{room.roomNumber ?? "—"}</p>
        </div>
        <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium ${roomStatusClasses[room.status]}`}>
          {roomStatusLabel[room.status]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/60 p-2">
          <BedSingle className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate text-xs text-muted-foreground">
            {room.singleBeds} solteiro
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/60 p-2">
          <BedDoubleIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate text-xs text-muted-foreground">
            {room.doubleBeds} casal
          </span>
        </div>
      </div>

      {clientName && (
        <div className="mt-3 flex min-h-14 min-w-0 items-center gap-3 rounded-lg border border-border/70 bg-muted/20 p-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRoundIcon className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Hóspede
            </p>
            <p className="truncate text-sm font-semibold">{clientName}</p>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-col items-center gap-1 border-t border-border/60 pt-3 text-center">
        {room.stay?.dailyRates ? (
          <CardDescription className="whitespace-nowrap text-xs font-medium">
            {room.stay.dailyRates} {room.stay.dailyRates === 1 ? "diária" : "diárias"}
          </CardDescription>
        ) : null}
        <CardDescription className="text-xs">
          Clique para ver detalhes
        </CardDescription>
      </div>
    </Card>
  )
}

export default SimpleRoomCard
