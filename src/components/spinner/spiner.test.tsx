import '@testing-library/jest-dom/vitest';
import { render, screen } from "@testing-library/react"
import SpinnerComp from "./spiner"

describe("Teste do componente Spinner", () => {
    const defaultProps = {
        title : "title",
        message : "message"
    }

    it("Deve renderizar o titulo e mensagem enviado por props", () => {
        render(
            <SpinnerComp {...defaultProps} />
        )

        expect(screen.getByText("title")).toBeInTheDocument()
        expect(screen.getByText("message")).toBeInTheDocument()
    })
    
    it("Deve renderizar titulo e mensagem default do componente", () => {
        render(
            <SpinnerComp message={undefined} title={undefined} />
        )

        expect(screen.getByText("Carregando...")).toBeInTheDocument()
        expect(screen.getByText("Aguarde um momento")).toBeInTheDocument()
    })

})