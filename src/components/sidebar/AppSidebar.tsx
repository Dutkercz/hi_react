import * as React from "react"

import { NavMain } from "@/components/sidebar/NavMain"
import {
  Sidebar,
  SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuItem
} from "@/components/ui/sidebar"
import { ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CircleHelpIcon, SearchIcon, Hotel, UserCog, Bed, ShieldQuestion, UserShield } from "lucide-react"
import NavAccount from "./NavAccount"
import NavAdmin from "./NavAdmin"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useUser } from "@/hooks/useUser"
import { useQuery } from "@tanstack/react-query"
import { userService } from "@/service/user"
import { Button } from "../ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Separator } from "../ui/separator"

const data = {
  navMain: [
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
      title: "Equipe",
      url: "/employes",
      icon: <UsersIcon />,
    },
    {
      title: "Get Help",
      url: "/help-page",
      icon: <CircleHelpIcon />
      ,
    },
    {
      title: "Search",
      url: "/search",
      icon: <SearchIcon />,
    },
  ],
  admin: [
    {
      title: "Métricas",
      url: "/admin",
      icon: <FolderIcon />,
    },
    {
      title: "Editar Apartamento",
      url: "/admin/rooms",
      icon: <Bed />
    },
    {
      title: "Cadastrar funcionário",
      url: "/admin/register-user",
      icon: <UserShield />
    }
  ],
  account: [
    {
      title: "Meus dados",
      url: "/account/me",
      icon: <UserCog />
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser()
  const { logout } = useAuth()

  const { data: userImg } = useQuery({
    queryKey: ["user-img", user.data?.email],
    queryFn: () => userService.getImg(),
    enabled: !!user.data,
    staleTime: Infinity,
  })
  const userData = user.data
  return (
    <Sidebar
      collapsible="offcanvas"
      className="h-screen w-60 border-r "
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border/80">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-center items-baseline gap-2 p-1 border bg-muted">
              <Hotel className="h-5 w-5" />
              <h1 className="text-base font-semibold text-center">Hotel Cris</h1>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      <SidebarContent className="bg-sidebar">
        <NavMain items={data.navMain} />
        <Separator className="mt-2 mb-2"/>
        <NavAdmin items={data.admin} />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage src={userImg} alt={userData?.fullName} />
            <AvatarFallback className="rounded-lg">
              {userData ? userData.fullName.substring(0, 2).toUpperCase()
                :
              <ShieldQuestion />}
            </AvatarFallback>
          </Avatar>
          <h2>{userData ? "Olá " + userData.fullName : "Faça login"}</h2>
          {user && <Button size="sm" onClick={logout} variant="link">Sair</Button>}
        </div>
        <SidebarContent>
          <NavAccount items={data.account} />
        </SidebarContent>
      </SidebarFooter>
    </Sidebar>
  )
}
