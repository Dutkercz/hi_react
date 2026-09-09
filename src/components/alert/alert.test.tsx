import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { AlertDialogModal } from './alert';


describe("Componente alert", () => {
    const mockOnConfirm = vi.fn()
    const mockIsOpen = vi.fn()

    const defaultProps = {
        id: 1,
        title: "title",
        message: "message",
        onConfirm: mockOnConfirm,
        isOpen: mockIsOpen
    }

    //limpar o historico antes de cada teste
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("Deve renderizar o titulo a mensagem dos mocks corretamente", () => {
        render(
            <AlertDialog open={true}>
                <AlertDialogModal {...defaultProps} />
            </AlertDialog>
        )

        expect(screen.getByText('title')).toBeInTheDocument();
        expect(screen.getByText('message')).toBeInTheDocument();
    })

    it("Deve apresentar a mensagens padrão quando nenhuma for fornecida", () => {
        render(
            <AlertDialog open={true}>
            <AlertDialogModal {...defaultProps} message={undefined}/>
        </AlertDialog>
        )
        expect(screen.getByText("Essa ação não pode ser desfeita. Deseja realmente continuar?")).toBeInTheDocument()
    })

    it("Deve fechar o modal e chamar o onConfirm com o ID correto", async () => {
        const userSetup = userEvent.setup()

        render(
            <AlertDialog open={true}>
              <AlertDialogModal {...defaultProps} />
            </AlertDialog>
        );

        const confirmButton = screen.getByRole("button", {name: /confirmar/i})

        await userSetup.click(confirmButton)

        // Valida se a função que controla a abertura foi chamada com "false"
        expect(mockIsOpen).toHaveBeenCalledWith(false)

        expect(mockOnConfirm).toHaveBeenCalledWith(1)
    })

    it("Deve fechar o modal e chamar sem chamar a função onConfirm", async () => {
        const userSetup = userEvent.setup()

        render(
            <AlertDialog open={true}>
              <AlertDialogModal {...defaultProps} />
            </AlertDialog>
        );

        const cancelButton = screen.getByRole("button", {name: /cancelar/i})

        await userSetup.click(cancelButton)


    })

    it('deve passar o ID -1 para o onConfirm caso a prop id não seja informada', async () => {
        const user = userEvent.setup();
    
        render(
          <AlertDialog open={true}>
            <AlertDialogModal {...defaultProps} id={undefined} />
          </AlertDialog>
      );
    
        const botaoConfirmar = screen.getByRole('button', { name: /confirmar/i });
        await user.click(botaoConfirmar);
    
        // Valida o fallback do id (id ?? -1)
        expect(mockOnConfirm).toHaveBeenCalledWith(-1);
      });

}) 