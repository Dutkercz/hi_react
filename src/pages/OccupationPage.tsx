import TooltipComponent from "@/components/tooltip/tooltip-component";
import { Input } from "@base-ui/react";
import { useOccupationPage } from "@/hooks/useOccupationPage";

const OccupationPage = () => {

  const {...data} = useOccupationPage() 

  return (
    <div className="flex m-1 h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex w-full flex-col gap-3 p-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-foreground sm:text-lg">Tabela de hospedagem</h2>
            <p className="text-sm text-muted-foreground">
              Visualização da ocupação por quarto e dia em {data.monthLabel}
            </p>
          </div>

          <div className="w-full sm:w-auto sm:flex-none">
            <Input className="w-full rounded-lg border-2 bg-muted p-2 sm:w-auto" type="month"
              value={data.selectedDate} onChange={data.handleChangeDate}
            />
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-muted-foreground sm:flex-1">
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

      </div>

      <div className="overflow-x-auto rounded-lg border bg-background/70">
        <div className="min-w-215">
          <div
            className="grid border-b border-border/70 bg-muted/70 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            style={{ gridTemplateColumns: `88px repeat(${data.days.length}, minmax(34px, 1fr))` }}
          >
            <div className="border-r border-border/70 px-3 py-2">Quarto</div>
            {data.days.map((day) => (
              <div key={day} className="border-r border-border/70  px-2 py-2 text-center last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {data.rooms?.map((room) => {
            const roomNumber = String(room.roomNumber)
            const occupiedDays = data.occupiedDaysByRoom.get(roomNumber) ?? new Set<number>()
            const clientNamesByDay = data.clientNamesByRoomAndDay.get(roomNumber) ?? new Map<number, string>()

            return (
              <div
                key={room.id}
                className={`grid ${room.id % 2 === 0 ? 'bg-background/90' : 'bg-muted/30'}`}
                style={{ gridTemplateColumns: `88px repeat(${data.days.length}, minmax(34px, 1fr))` }}
              >
                <div className="border-r border-t border-border/70 px-3 py-2 text-sm font-medium text-foreground">
                  Apto {room.roomNumber}
                </div>

                {data.days.map((day) => {
                  const today = new Date()
                  const isToday = data.selectedYear === today.getFullYear()
                    && data.selectedMonth === today.getMonth() + 1
                    && day === today.getDate()
                  const isOccupied = occupiedDays.has(day)

                  return (
                    <div
                      key={`${room.id}-${day}`}
                      className={`flex items-center justify-center border-r border-t border-border/70 p-1 last:border-r-0 ${isOccupied ? 'text-destructive' : 'text-chart-1'}`}
                    >
                      <div className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] ${isToday ? 'font-extrabold' : 'font-light'}`}>
                        <TooltipComponent
                          hover={day}
                          tooltipContent={isOccupied ? clientNamesByDay.get(day) ?? "Cliente não informado" : "Livre"} />
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