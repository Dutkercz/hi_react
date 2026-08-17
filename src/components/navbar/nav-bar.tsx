import { Link } from 'react-router-dom'
import {
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList
} from "@/components/ui/navigation-menu"
import { House, ReceiptText } from "lucide-react"


export const NavBar = () => {

    return (
        <div className="flex h-12 items-center bg-primary">

            <NavigationMenu className="w-full max-w-none justify-start">
                <NavigationMenuList>

                    <NavigationMenuItem>
                        <NavigationMenuLink
                            render={
                                <Link to={"/"}><House/> Inicio</Link>
                            }
                        ></NavigationMenuLink>
                    </NavigationMenuItem>
                            
                    <NavigationMenuItem>
                        <NavigationMenuLink render={
                            <Link
                                to="/bookings"
                                className="flex items-center justify-center"
                            >
                                <ReceiptText />
                                <span>Reservas</span>
                            </Link>
                        }>
                        </NavigationMenuLink>
                    </NavigationMenuItem>


                    <NavigationMenuItem>
                        <NavigationMenuLink render={
                            <Link
                                to="/register"
                                className="flex items-center justify-center"
                            >
                                <ReceiptText />
                                <span>Cadastre-se</span>
                            </Link>
                        }>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
