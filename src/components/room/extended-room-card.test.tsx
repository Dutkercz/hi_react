import { vi } from "vitest";
import { useRoomCard } from "./useRoomCard";
import type { RoomResponse } from "@/api/room";
import { render, screen } from "@testing-library/react";
import ExtendedRoomCard from "./extended-room-card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock('./useRoomCard', () => ({
    useRoomCard: vi.fn()
}))

describe("Teste do componente ExtendedRoomCard", () => {

    const mockRoom: RoomResponse = {
        id: 1,
        status: "AVAILABLE",
        roomNumber: '1',
        singleBeds: 2,
        doubleBeds: 1,
        stay: null,
    }

    const renderWithProviders = (ui: React.ReactElement) => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        return render(
            <QueryClientProvider client={queryClient}>
                {ui}
            </QueryClientProvider>
        );
    };

    const mockHandleAddDaily = vi.fn()
    const mockHandleUpdateStay = vi.fn()
    const mockHandleRefundAmount = vi.fn()
    const mockHandleCheckout = vi.fn()
    const mockFormatCurrency = vi.fn()

    const baseHookReturn = {
        handleAddDaily: mockHandleAddDaily,
        formatCurrency: mockFormatCurrency,
        dailyPrice: { 1: 150, 2: 250, 3: 350, 4: 450 },
        roomStatus: 'Disponível',
        roomStatusClasses: 'bg-green-100',
        stayStatus: {
            CURRENT: "Em andamento",
            CANCELED: "Cancelada",
            FINISHED: "Finalizada",
        },
        handleUpdateStay: mockHandleUpdateStay,
        handleCheckout: mockHandleCheckout,
        handleRefundAmount: mockHandleRefundAmount,
    };

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("Deve renderizar as informações do apartmaneto", () => {
        vi.mocked(useRoomCard).mockReturnValue(baseHookReturn)

        renderWithProviders(<ExtendedRoomCard room={mockRoom} />);

        expect(screen.getByText("Apartamento 1")).toBeInTheDocument()
        expect(screen.getByText("Disponível")).toBeInTheDocument()
    })

    it("Deve informar as informações da diária quando existir uma ativa", () => {
        const mockRoomWithStay: RoomResponse = {
            ...mockRoom,
            stay: {
                id: 1,
                client: { id: 99, firstName: 'Cristian', lastName: 'Rosa' },
                room: {id: 1, roomNumber: '1'},
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

        vi.mocked(useRoomCard).mockReturnValue({...baseHookReturn, roomStatus : "Ocupado"})

        renderWithProviders(<ExtendedRoomCard room={mockRoomWithStay} />)

        expect(screen.getByText("Cristian Rosa")).toBeInTheDocument()
        expect(screen.getByText("Ocupado")).toBeInTheDocument()
        expect(screen.getByText("A pagar")).toBeInTheDocument()

        expect(screen.getByRole('button', {name: /Checkout/i}))
        
        
    })


})