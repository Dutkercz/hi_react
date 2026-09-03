import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import HomePage from "./pages/home-page"
import { Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import OccupationPage from "./pages/occupation-page"
import RegisterPage from "./pages/register-page"
import DashboardPage from "./pages/dashboard-page"
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar"
import { AppSidebar } from "./components/sidebar/app-sidebar"
import HelpPage from "./pages/help-page"
import AdminPage from "./pages/admin-page"
import { ProtectedAdminRoute } from "./components/admin/admin-route"

const client = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={client}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />

        <SidebarInset className="min-h-screen bg-background">
          <Toaster />

          <div className="min-h-screen w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bookings" element={<OccupationPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>} />
              <Route path="/help-page" element={<HelpPage />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  )
}

export default App
