import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import HomePage from "./pages/home-page"
import { Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import OccupationPage from "./pages/occupation-page"
import RegisterPage from "./pages/register-page"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/sidebar/app-sidebar"
import HelpPage from "./pages/help-page"
import AdminPage from "./pages/admin-page"
import AdminDashboardPage from "./pages/admin-dashboard-page"
import { ProtectedRoute } from "./components/admin/protected-route"
import AdminRoom from "./components/admin/admin-room"

const client = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={client}>

      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 60)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="floating" />
        <SidebarInset className="min-h-screen bg-background">
          <Toaster />

          <div className="min-h-screen w-full">
            <SidebarTrigger className="-ml-1" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bookings" element={<OccupationPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>}
                children={
                  <>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="rooms" element={<AdminRoom />} />
                  </>
                }
              />

              <Route path="/help-page" element={<HelpPage />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  )
}

export default App
