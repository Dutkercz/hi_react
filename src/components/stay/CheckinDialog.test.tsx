import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { vi } from "vitest"
import { Dialog } from "../ui/dialog"
import { useRoomCard } from "../../hooks/useRoomCard"
import { useStayRequest } from "@/hooks/useStayRequest"
import type { StayRequest } from "@/types/stays"
import type { RoomResponse } from "@/types/room"
import CheckinDialog from "./CheckinDialog"

vi.mock("../../hooks/useRoomCard", () => ({
  useRoomCard: vi.fn(),
}))

vi.mock("@/hooks/useStayRequest", () => ({
  useStayRequest: vi.fn(),
}))

const room: RoomResponse = {
  id: 42,
  roomNumber: "12",
  singleBeds: 2,
  doubleBeds: 1,
  status: "AVAILABLE",
  stay: null,
}

const setOpen = vi.fn()
const handleClose = vi.fn()
const handleCpfSearch = vi.fn()
const handleCpfChange = vi.fn()
const subtmitStay = vi.fn()

const CheckinDialogHarness = () => {
  const form = useForm<StayRequest>({
    defaultValues: {
      clientId: 7,
      roomId: room.id,
      checkIn: "2026-11-17T14:00",
      checkOut: "2026-11-18T11:00",
      totalGuests: 1,
      isPaid: false,
      method: "PIX",
      stayGuests: [],
    },
  })

  vi.mocked(useStayRequest).mockReturnValue({
    cpfValue: "",
    handleCpfChange,
    clientName: "",
    cpfPending: false,
    handleClose,
    handleCpfSearch,
    form,
    subtmitStay,
    stayPending: false,
  })

  return (
    <Dialog open>
      <CheckinDialog room={room} setOpen={setOpen} />
    </Dialog>
  )
}

const renderDialog = () => {
  vi.mocked(useRoomCard).mockReturnValue({
    handleAddDaily: vi.fn(),
    formatCurrency: (value) => String(value),
    roomStatus: "Disponível",
    roomStatusClasses: "",
    stayStatus: {
      CURRENT: "Em andamento",
      CANCELED: "Cancelada",
      FINISHED: "Finalizada",
    },
    dailyPrice: { 1: 100, 2: 150, 3: 200, 4: 250 },
    handleUpdateStay: vi.fn(),
    handleCheckout: vi.fn(),
    handleRefundAmount: vi.fn(),
  })

  return render(<CheckinDialogHarness />)
}

describe("CheckinDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the room and stay fields", () => {
    renderDialog()

    expect(screen.getByText("Check-in Apartamento 12")).toBeInTheDocument()
    expect(screen.getByText("Nenhum cliente selecionado")).toBeInTheDocument()
    expect(screen.getByLabelText("Total de hóspedes")).toHaveValue(1)
    expect(screen.getByLabelText("Entrada")).toBeInTheDocument()
    expect(screen.getByLabelText("Saída")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Buscar CPF" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Salvar hospedagem" })).toBeInTheDocument()
  })

  it("shows payment methods only when the stay is marked as paid", async () => {
    const user = userEvent.setup()
    renderDialog()

    expect(screen.queryByRole("radio", { name: "PIX" })).not.toBeInTheDocument()

    await user.click(screen.getByRole("checkbox", { name: "Pago no check-in" }))

    expect(screen.getByRole("radio", { name: "PIX" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Dinheiro" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Cartão Crédito" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Cartão Débito" })).toBeInTheDocument()
  })

  it("keeps the extra guest fields in sync with the guest count", async () => {
    renderDialog()
    const totalGuests = screen.getByLabelText("Total de hóspedes")

    fireEvent.change(totalGuests, { target: { value: "3" } })

    expect(await screen.findByPlaceholderText("Nome do hóspede 2")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Nome do hóspede 3")).toBeInTheDocument()

    fireEvent.change(totalGuests, { target: { value: "2" } })

    await waitFor(() => {
      expect(screen.queryByPlaceholderText("Nome do hóspede 3")).not.toBeInTheDocument()
    })
    expect(screen.getByPlaceholderText("Nome do hóspede 2")).toBeInTheDocument()
  })

  it("calls the CPF search and submits the stay", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "Buscar CPF" }))
    await user.click(screen.getByRole("button", { name: "Salvar hospedagem" }))

    expect(handleCpfSearch).toHaveBeenCalled()
    expect(subtmitStay.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        clientId: 7,
        roomId: room.id,
        totalGuests: 1,
        isPaid: false,
      }),
    )
  })
})
