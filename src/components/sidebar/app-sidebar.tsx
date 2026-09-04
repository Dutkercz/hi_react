import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import {
  Sidebar,
  SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon, Hotel } from "lucide-react"

const data = {

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Quadro mensal",
      url: "/bookings",
      icon: <ListIcon />,
    },
    {
      title: "Cadastrar Cliente",
      url: "/register",
      icon: <ChartBarIcon />,
    },
    {
      title: "Admin",
      url: "/admin",
      icon: <FolderIcon />,
    },
    {
      title: "Equipe",
      url: "/employes",
      icon: <UsersIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "/help-page",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="h-screen w-60 border-r "
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border/80">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2">
              <Hotel className="h-5 w-5" />
              <h1 className="text-base font-semibold">Hotel Cris</h1>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
    </Sidebar>
  )
}
