import type { RoomResponse } from "@/api/room"
import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import AddPaymentDialog from "./add-payment-dialog"
import { useAddPayment } from "./useAddPayment"
import type { ReactElement } from "react"
import { Dialog } from "@base-ui/react"
import { useFormatCurrency } from "@/hooks/use-formart-currency"
import userEvent from "@testing-library/user-event"

vi.mock("./useAddPayment", () => ({
    useAddPayment: vi.fn()
}))

describe("Teste do Componente AddPaymentDialog", () => {

    const mockSetOpen = vi.fn()
    const mockHandleSubmit = vi.fn()
    const format = useFormatCurrency()

    const mockRoom: RoomResponse = {
        id: 1,
        status: "OCCUPIED",
        roomNumber: '1',
        singleBeds: 2,
        doubleBeds: 1,
        stay: {
            id: 1,
            client: { id: 99, firstName: 'Cristian', lastName: 'Rosa' },
            room: { id: 1, roomNumber: '1' },
            checkIn: '2026-09-05T13:00:00',
            checkOut: '2026-09-08T09:00:00',
            dailyRates: 3,
            dailyPrice: 150,
            paidPrice: 400,
            remainingPrice: 50.00,
            totalPrice: 450,
            isPaid: false,
            stayStatus: 'CURRENT',
        }
    }

    const mockHookReturn = {
        handleSubmit: mockHandleSubmit,
        formatCurrency: format,
        remainingPrice: 0,
        isPending: false
    }

    const renderWithProviders = (ui: ReactElement) => {
        return render(
            <Dialog.Root open={true}>
                {ui}
            </Dialog.Root>
        )
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("Deve renderizar as informações do dialog corretamente", () => {
        vi.mocked(useAddPayment).mockReturnValue(mockHookReturn)
        renderWithProviders(<AddPaymentDialog room={mockRoom} setOpen={mockSetOpen} />)

        expect(screen.getByText("Financeiro")).toBeInTheDocument()
        expect(screen.getByText("Apartamento 1 · Cristian Rosa")).toBeInTheDocument()
        expect(screen.getByText("Valor já pago")).toBeInTheDocument()
        expect(screen.getByText("R$ 400,00")).toBeInTheDocument()
        expect(screen.getByText("Saldo restante")).toBeInTheDocument()
    })

    it("Deve chamar a função de de submit", async () => {
        vi.mocked(useAddPayment).mockReturnValue(mockHookReturn)
        renderWithProviders(<AddPaymentDialog room={mockRoom} setOpen={mockSetOpen}/>)
        
        const user = userEvent.setup()
        const buttonRegistrarPagamento = screen.getByRole("button", {name: "Registrar pagamento"})
        const fieldValorDoPagamento = screen.getByLabelText("Valor do pagamento")
        expect(buttonRegistrarPagamento).toBeInTheDocument()
        expect(fieldValorDoPagamento).toBeInTheDocument()
        
        await user.type(fieldValorDoPagamento, "50")
        await user.click(buttonRegistrarPagamento)
        expect(mockHandleSubmit).toHaveBeenCalledWith("R$ 50,00")
    })


})