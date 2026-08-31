import { roomService } from "@/api/room";
import { useQuery } from "@tanstack/react-query";

const OccupationPage = () => {

    const {data : rooms} = useQuery({
        queryKey: ["rooms"],
        queryFn: () => roomService.getAll()
    })


    const ano = new Date().getFullYear();
    const mes = new Date().getMonth() + 1;
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

                    {rooms?.map((room) => (
                        <div
                            key={room.id}
                            className={`grid ${room.id % 2 === 0 ? 'bg-background/90' : 'bg-muted/30'}`}
                            style={{ gridTemplateColumns: `88px repeat(${days.length}, minmax(34px, 1fr))` }}
                        >
                            <div className="border-r border-t border-border/70 px-3 py-2 text-sm font-medium text-foreground">
                                Apto {room.roomNumber}
                            </div>

                            {days.map((day) => {
                                const isOccupied = room.status === "OCCUPIED"
                                const today = new Date().getDate()                                

                                return (
                                    <div
                                        key={`${room}-${day}`}
                                        className={`flex items-center bg-muted justify-center border-r border-t border-border/70 p-1 last:border-r-0 ${isOccupied && today === day?  'text-destructive' : 'text-chart-1'
                                            }`}
                                    >
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] '
                                            } ${day === today ? 'font-extrabold' : 'font-light'}`}>
                                            {day}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OccupationPage