import { vi } from "vitest";
import { useRoomCard } from "./useRoomCard";
import type { RoomResponse } from "@/api/room";
import { render, screen } from "@testing-library/react";
import ExtendedRoomCard from "./extended-room-card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

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

    it("Deve renderizar as informações da diária quando existir uma ativa", async () => {

        vi.mocked(useRoomCard).mockReturnValue({ ...baseHookReturn, roomStatus: "Ocupado" })

        renderWithProviders(<ExtendedRoomCard room={mockRoomWithStay} />)

        expect(screen.getByText("Cristian Rosa")).toBeInTheDocument()
        expect(screen.getByText("Ocupado")).toBeInTheDocument()
        expect(screen.getByText("A pagar")).toBeInTheDocument()
    })

    it("Deve chamar a função de checkout corretamente", async () => {
        vi.mocked(useRoomCard).mockReturnValue({ ...baseHookReturn, roomStatus: "Ocupado" })
        renderWithProviders(<ExtendedRoomCard room={mockRoomWithStay} />)

        const user = userEvent.setup()

        const checkoutButton = screen.getByRole("button", { name: /Checkout/i })
        expect(checkoutButton).toBeInTheDocument()
        await user.click(checkoutButton)
        const confirDialogButton = screen.getByRole("button", { name: /Confirmar/i })
        expect(confirDialogButton).toBeInTheDocument()
        await user.click(confirDialogButton)
        expect(mockHandleCheckout).toHaveBeenCalledWith(1)
    })

    it("Deve chamar a função de adicionar diária corretamente", async () => {

        vi.mocked(useRoomCard).mockReturnValue({ ...baseHookReturn, roomStatus: "Ocupado" })
        renderWithProviders(<ExtendedRoomCard room={mockRoomWithStay} />)

        const user = userEvent.setup()

        const buttonAdicionarDiaria = screen.getByRole("button", { name: /Adicionar diária/i })
        expect(buttonAdicionarDiaria).toBeInTheDocument()
        await user.click(buttonAdicionarDiaria)
        expect(mockHandleAddDaily).toHaveBeenCalledWith(1)
    })

    it("Deve renderizar um card pronto para hospedar ao clicar em um livre ", async () => {

        vi.mocked(useRoomCard).mockReturnValue(baseHookReturn)
        renderWithProviders(<ExtendedRoomCard room={mockRoom} />)

        const user = userEvent.setup()

        const checkinButton = screen.getByRole("button", { name: "Checkin" })
        expect(checkinButton).toBeInTheDocument()
        await user.click(checkinButton)
        expect(screen.getByText("Check-in Apartamento 1"))
        expect(screen.getByText("01 pessoa")).toBeInTheDocument()
        expect(screen.getByText("Cama solteiro")).toBeInTheDocument()
    })


})