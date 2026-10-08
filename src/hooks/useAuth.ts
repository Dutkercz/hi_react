import AuthContext from "@/context/AuthContext"
import { useContext } from "react"

export const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context){
        throw new Error("o hook deve ser usado dentro de um Provider")
    }
    return context
}