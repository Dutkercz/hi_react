import { roomService } from "@/api/room"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { useQuery } from "@tanstack/react-query"
import { Edit } from "lucide-react"

const AdminPage = () => {

    const { data: rooms, isLoading, isError } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => roomService.getAll()
    })

    if (isLoading) return <Spinner />
    if (isError) return <div>Erro</div>

    return (
        <Card className="m-1">
            <CardTitle className="m-1">Gerenciar Apartamento</CardTitle>
            <CardDescription className="ml-2">Editar configuração dos apartamentos</CardDescription>
            <div className="grid grid-cols-3 gap-2 m-2">
                {rooms?.map((room) => (
                    <div key={room.id} className="p-2 border bg-muted rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-center">Apartamento = </p>
                            <span className="text-muted-foreground">{room.roomNumber}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-2">

                            {room.doubleBeds > 0 &&
                                <div className="flex items-center justify-center gap-2">
                                    <span>Cama de casal {room.doubleBeds}</span>
                                    <Button size="icon-sm" variant="outline" >
                                        <Edit />
                                    </Button>
                                </div>
                            }
                            {room.doubleBeds > 0 && room.singleBeds > 0 &&  <Separator orientation="vertical"/>}
                           
                            {room.singleBeds > 0 &&
                                <div className="flex items-center justify-center gap-2">
                                    <span>Camas de solteiro {room.singleBeds}</span>
                                    <Button size="icon-sm" variant="outline" >
                                        <Edit />
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default AdminPage