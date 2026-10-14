import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Link, useLocation } from 'react-router-dom'
import { Separator } from '../ui/separator'
import { CardTitle } from '../ui/card'
import { UserShield } from 'lucide-react'

type NavAdminProps = {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}

const NavAdmin = ({ items }: NavAdminProps) => {
  const { pathname } = useLocation()
  return (
    <div>
      <CardTitle>
        <div className='flex items-baseline justify-center m-1 gap-2 p-1 border bg-muted '>
          <UserShield size={20}/>
          <CardTitle>
            Administração
          </CardTitle>
        </div>
      </CardTitle>
      <SidebarMenu className='p-2'>
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
              <Separator className="m-1" />
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </div>
  )
}

export default NavAdmin