import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { House } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Separator } from "../ui/separator"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              render={<Link to="/" />}
              tooltip="Página Inicial"
              isActive={pathname === "/"}
              className={pathname === "/" ? "min-w-8 bg-primary text-primary-foreground duration-300 transform transition ease-linear hover:bg-primary/90 hover:text-primary-foreground scale-105 active:bg-primary/90 active:text-primary-foreground" : "min-w-8"}
            >
              <House />
              <span>Página Inicial</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
              <Separator className="mt-0.5"/>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link to={item.url} />}
                  tooltip={item.title}
                  isActive={isActive}
                  className={isActive ? "min-w-8 bg-primary text-primary-foreground duration-300 transform transition ease-linear hover:bg-primary/90 hover:text-primary-foreground scale-110 active:bg-primary/90 active:text-primary-foreground" : ""}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
                <Separator className="m-1"/>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
