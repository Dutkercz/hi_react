import { roomService } from "@/service/room";
import { stayService } from "@/service/stay";
import { useQuery } from "@tanstack/react-query";
import { useState, type BaseSyntheticEvent } from "react";

export const useOccupationPage = () => {
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
      const clientNamesByRoomAndDay = new Map<string, Map<number, string>>()
    
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
        if (!clientNamesByRoomAndDay.has(roomKey)) {
          clientNamesByRoomAndDay.set(roomKey, new Map())
        }
    
        while (current <= iterationEnd) {
          occupiedDaysByRoom.get(roomKey)?.add(current.getDate())
          clientNamesByRoomAndDay.get(roomKey)?.set(current.getDate(), stay.clientName)
          current.setDate(current.getDate() + 1)
        }
      })
    
      const totalDias = new Date(selectedYear, selectedMonth, 0).getDate();
      const days = Array.from({ length: totalDias }, (_, i) => i + 1);
      const monthLabel = new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(selectedYear, selectedMonth - 1, 1));


    return {monthLabel, days, selectedDate, handleChangeDate, rooms, 
        occupiedDaysByRoom, clientNamesByRoomAndDay, selectedMonth, selectedYear}
}