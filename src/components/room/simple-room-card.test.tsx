import type { RoomResponse } from "@/api/room"
import { render, screen } from "@testing-library/react"
import SimpleRoomCard from "./simple-room-card"

describe("Teste do componente SimpleRoomCard", () => {

    const mockRoom: RoomResponse = {
        id: 1,
        status: "AVAILABLE",
        roomNumber: '1',
        singleBeds: 2,
        doubleBeds: 1,
        stay: null,
    }

    const mockRoomWithStay: RoomResponse = {
        ...mockRoom,
        stay: {
            id: 1,
            client: { id: 99, firstName: 'Cristian', lastName: 'Rosa' },
            room: { id: 1, roomNumber: '1' },
            checkIn: '2026-09-05T13:00:00',
            checkOut: '2026-09-08T09:00:00',
            dailyRates: 3,
            dailyPrice: 150,
            paidPrice: 450,
            remainingPrice: 0,
            totalPrice: 450,
            isPaid: true,
            stayStatus: 'CURRENT',
        }
    }


    it("Deve exibir as informações de Apartamento livre", () => {

        render(<SimpleRoomCard room={mockRoom} />)

        expect(screen.getByText("Disponível")).toBeInTheDocument()
        expect(screen.getByText("Apartamento")).toBeInTheDocument()
        expect(screen.getByText("Clique para ver detalhes")).toBeInTheDocument()
    })

    it("Deve exibir as informações de cliente e apartamento quando existir diária ativa", () => {

        render(<SimpleRoomCard room={{ ...mockRoomWithStay, status: "OCCUPIED" }} />)

        expect(screen.getByText("Cristian Rosa")).toBeInTheDocument()
        expect(screen.getByText("Ocupado")).toBeInTheDocument()
        expect(screen.getByText("Apartamento")).toBeInTheDocument()
        expect(screen.getByText("1")).toBeInTheDocument()
        expect(screen.getByText("3 Diárias")).toBeInTheDocument()
        expect(screen.getByText("Clique para ver detalhes")).toBeInTheDocument()
    })
})