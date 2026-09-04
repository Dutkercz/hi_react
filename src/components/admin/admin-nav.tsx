import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Bed, ReceiptText } from "lucide-react"
import { NavLink } from "react-router-dom"

export function AdminNavigation() {
    return (
        <NavigationMenu 
        className="mx-auto w-full max-w-none border-b border-border px-2 py-2">
            <NavigationMenuList className="w-full gap-2 sm:gap-3">

                <NavigationMenuItem>
                    <NavigationMenuLink
                        render={<NavLink to="/admin/rooms" />}
                        className={cn(
                            navigationMenuTriggerStyle(),
                            "group h-10 w-full gap-2 rounded-xl border border-transparent px-4 text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-background hover:text-foreground hover:shadow-md data-active:border-primary/20 data-active:bg-primary/10 data-active:text-primary data-active:shadow-sm sm:w-auto"
                        )}
                    >
                        <Bed className="size-4 transition-transform duration-200 group-hover:scale-110" />
                        Apartamentos
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink
                        render={<NavLink to="/admin/daily-rates" />}
                        className={cn(
                            navigationMenuTriggerStyle(),
                            "group h-10 w-full gap-2 rounded-xl border border-transparent px-4 text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-background hover:text-foreground hover:shadow-md data-active:border-primary/20 data-active:bg-primary/10 data-active:text-primary data-active:shadow-sm sm:w-auto"
                        )}
                    >
                        <ReceiptText className="size-4 transition-transform duration-200 group-hover:scale-110" />
                        Diárias
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}