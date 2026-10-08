import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const client = new QueryClient()


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>

      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
