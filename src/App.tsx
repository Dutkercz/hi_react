import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import HomePage from "./pages/home-page"
import { NavBar } from "./components/navbar/nav-bar"
import { Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import OccupationPage from "./pages/occupation-page"
import RegisterPage from "./pages/register-page"

const client = new QueryClient()

const App = () => {

  return (
    <QueryClientProvider client={client}>
      <Toaster />
      <header>
        <NavBar />
      </header>

      <div className="min-h-screen max-w-full">

        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/bookings" element={<OccupationPage />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>

      </div>


    </QueryClientProvider>

  )

}

export default App
