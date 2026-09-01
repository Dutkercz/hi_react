import { roomService } from "@/api/room";
import { stayService } from "@/api/stay";
import { useQuery } from "@tanstack/react-query";

const OccupationPage = () => {

    const { data: rooms } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => roomService.getAll()
    })

    const { data: monthOccupation } = useQuery({
        queryKey: ["rooms-status"],
        queryFn: () => stayService.monthlyStatusBoard()
    })

    const ano = new Date().getFullYear();
    const mes = new Date().getMonth() +1;
    const monthStart = new Date(ano, mes - 1, 1)
    const monthEnd = new Date(ano, mes, 0, 23, 59, 59, 999)

    const occupiedDaysByRoom = new Map<string, Set<number>>()

    monthOccupation?.forEach((stay) => {
        const roomKey = String(stay.roomNumber)
        const start = new Date(stay.checkIn)
        const end = new Date(stay.checkOut)

        if (start > monthEnd || end < monthStart) {
            return
        }

        const iterationStart = new Date(Math.max(start.getTime(), monthStart.getTime()))
        const iterationEnd = new Date(Math.min(end.getTime(), monthEnd.getTime()))
        const current = new Date(iterationStart)

        current.setHours(0, 0, 0, 0)
        iterationEnd.setHours(0, 0, 0, 0)

        if (!occupiedDaysByRoom.has(roomKey)) {
            occupiedDaysByRoom.set(roomKey, new Set())
        }

        while (current <= iterationEnd) {
            occupiedDaysByRoom.get(roomKey)?.add(current.getDate())
            current.setDate(current.getDate() + 1)
        }
    })

    const totalDias = new Date(ano, mes, 0).getDate();
    const days = Array.from({ length: totalDias }, (_, i) => i + 1);
    const monthLabel = new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(ano, mes - 1, 1));

    return (
        <div className="flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                    <h2 className="text-lg font-semibold text-foreground">Tabela de hospedagem</h2>
                    <p className="text-sm text-muted-foreground">
                        Visualização da ocupação por quarto e dia em {monthLabel}
                    </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-chart-1" />
                        Disponível
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                        Ocupado
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-md border bg-background/70">
                <div className="min-w-215">
                    <div
                        className="grid border-b border-border/70 bg-muted/70 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        style={{ gridTemplateColumns: `88px repeat(${days.length}, minmax(34px, 1fr))` }}
                    >
                        <div className="border-r border-border/70 px-3 py-2">Quarto</div>
                        {days.map((day) => (
                            <div key={day} className="border-r border-border/70  px-2 py-2 text-center last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {rooms?.map((room) => {
                        const roomNumber = String(room.roomNumber)
                        const occupiedDays = occupiedDaysByRoom.get(roomNumber) ?? new Set<number>()

                        return (
                            <div
                                key={room.id}
                                className={`grid ${room.id % 2 === 0 ? 'bg-background/90' : 'bg-muted/30'}`}
                                style={{ gridTemplateColumns: `88px repeat(${days.length}, minmax(34px, 1fr))` }}
                            >
                                <div className="border-r border-t border-border/70 px-3 py-2 text-sm font-medium text-foreground">
                                    Apto {room.roomNumber}
                                </div>

                                {days.map((day) => {
                                    const today = new Date().getDate()
                                    const isOccupied = occupiedDays.has(day)

                                    return (
                                        <div
                                            key={`${room.id}-${day}`}
                                            className={`flex items-center justify-center border-r border-t border-border/70 p-1 last:border-r-0 ${isOccupied ? 'text-destructive' : 'text-chart-1'}`}
                                        >
                                            <div className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] ${day === today ? 'font-extrabold' : 'font-light'}`}>
                                                {day}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default OccupationPage