import { roomService } from "@/api/room";
import { stayService } from "@/api/stay";
import TooltipComponent from "@/components/tooltip/tooltip-component";
import { Input } from "@base-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState, type BaseSyntheticEvent } from "react";

const OccupationPage = () => {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const [selectedDate, setSelectedDate] = useState<string>(
        `${currentYear}-${String(currentMonth).padStart(2, "0")}`
    )
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
    const [selectedYear, setSelectedYear] = useState<number>(currentYear)
    const monthStart = new Date(selectedYear, selectedMonth - 1, 1)
    const monthEnd = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999)
    const occupiedDaysByRoom = new Map<string, Set<number>>()
    const clientNames = new Map<number, string>()

    const handleChangeDate = (e: BaseSyntheticEvent) => {
        const inputValue = e.target.value;
        setSelectedDate(inputValue);
        if (inputValue) {
            const [year, month] = inputValue.split("-").map(Number)
            setSelectedMonth(month)
            setSelectedYear(year)
        }

    }

    const { data: rooms } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => roomService.getAll()
    })

    const { data: monthOccupation } = useQuery({
        queryKey: ["rooms-status", selectedYear, selectedMonth],
        queryFn: () => stayService.monthlyStatusBoard(selectedYear, selectedMonth),

    })

    monthOccupation?.forEach((stay) => {
        const roomKey = String(stay.roomNumber)
        const start = new Date(stay.checkIn)

        clientNames.set(Number(stay.roomNumber), stay.clientName)

        const end = new Date(stay.checkOut)
        end.setDate(end.getDate() - 1);

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

    const totalDias = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = Array.from({ length: totalDias }, (_, i) => i + 1);
    const monthLabel = new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(selectedYear, selectedMonth - 1, 1));

    return (
        <div className="flex m-1 h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">

                <div className="flex items-center justify-center p-2 gap-4">
                    <div className="flex-3">
                        <h2 className="text-lg font-semibold text-foreground">Tabela de hospedagem</h2>
                        <p className="text-sm text-muted-foreground">
                            Visualização da ocupação por quarto e dia em {monthLabel}
                        </p>
                    </div>

                    <div className="flex-1">
                        <Input className="border-2 rounded-lg bg-muted p-2" type="month"
                            value={selectedDate} onChange={handleChangeDate}
                        />
                    </div>

                    <div className="flex flex-1 gap-3 text-xs text-muted-foreground">
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
                                    const today = new Date()
                                    const isToday = selectedYear === today.getFullYear()
                                        && selectedMonth === today.getMonth() + 1
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
                                                tooltipContent={clientNames.get(Number(room.roomNumber))?? "Livre" } />
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