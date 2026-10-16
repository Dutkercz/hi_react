import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Link, useLocation } from 'react-router-dom'
import { Separator } from '@base-ui/react'

type NavAccountProps = {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}

const NavAccount = ({ items }: NavAccountProps) => {
  const { pathname } = useLocation()

  return (
 <SidebarMenu className='p-2'>
        {items.map((item) => {
        const isActive = pathname === item.url

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              render={<Link to={item.url} />}
              tooltip={item.title}
              isActive={isActive}
              className={isActive ? 
                "min-w-8 bg-primary text-primary-foreground duration-300 transform transition ease-linear hover:bg-primary/90 hover:text-primary-foreground scale-110 active:bg-primary/90 active:text-primary-foreground" : ""}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
            <Separator className="m-1" />
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export default NavAccount