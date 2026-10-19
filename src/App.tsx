import HomePage from "./pages/HomePage"
import { Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import OccupationPage from "./pages/OccupationPage"
import RegisterPage from "./pages/RegisterPage"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/sidebar/AppSidebar"
import HelpPage from "./pages/HelpPage"
import AdminPage from "./pages/AdminPage"
import AdminDashboard from "./components/admin/AdminDashboard"
import { ProtectedRoute } from "./components/routes/RoutesProtect"
import AdminRoom from "./components/admin/AdminRoom"
import LoginPage from "./pages/LoginPage"
import MyAccountPage from "./pages/MyAccountPage"
import RegisterUserPage from "./pages/RegisterUserPage"
import AdminDailyPrices from "./components/admin/AdminDailyPrices"
import SearchPage from "./pages/SearchPage"
import NotFoundPage from "./pages/NotFoundPage"


const App = () => {
  return (
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFoundPage />} />

                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>}
                  children={
                    <>
                      <Route index element={<AdminDashboard />} />
                      <Route path="rooms" element={<AdminRoom />} />
                      <Route path="register-user" element={<RegisterUserPage />} />
                      <Route path="daily-prices" element={<AdminDailyPrices />} />
                    </>
                  }
                />

                <Route path="/help-page" element={<HelpPage />} />

                <Route path="/account/me" element={
                  <ProtectedRoute>
                    <MyAccountPage />
                  </ProtectedRoute>}
                />

              </Routes>
            </div>
          </SidebarInset>
        </SidebarProvider>
  )
}

export default App
