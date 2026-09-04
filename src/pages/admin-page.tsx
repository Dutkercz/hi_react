import { roomService } from "@/api/room"
import SpinnerComp from "@/components/spinner/spiner"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"

const AdminPage = () => {

    const { data: rooms, isLoading, isError } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => roomService.getAll()
    })

    if (isLoading) return <SpinnerComp />
    if (isError) return <div>Erro</div>

    return (
        <Card className="m">
            <CardTitle className="m-1">Gerenciar Apartamento</CardTitle>
            <CardDescription className="ml-2">Editar configuração dos apartamentos</CardDescription>
            <div className="grid grid-cols-3 gap-2 m-2">
                {rooms?.map((room) => (
                    <div key={room.id} className="p-2 border bg-muted rounded-lg">
                        <div className="flex-col m-1">
                            <p className="text-center">Apartamento </p>
                            <span 
                            className="flex justify-center text-muted-foreground p-0.5 text-xl">
                                {room.roomNumber}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center gap-2 p-2">

                            {room.doubleBeds > 0 &&
                                <div className="flex flex-col items-center justify-center">
                                    <label htmlFor="doubleBeds">Cama de casal</label>
                                    <Input
                                        id="doubleBeds"
                                        type="text"
                                        className="w-20 text-center mt-2 border rounded-sm p-1.5 bg-background"
                                        value={room.doubleBeds}
                                    />
                                </div>
                            }
                            {room.doubleBeds > 0 && room.singleBeds > 0 &&
                                <Separator orientation="vertical" />}

                            {room.singleBeds > 0 &&
                                <div className="flex flex-col items-center justify-center">
                                <label htmlFor="singleBeds">Camas de solteiro</label>
                                    <Input
                                        id="singleBeds"
                                        type="text"
                                        className="w-20 text-center mt-2 border rounded-sm p-1.5 bg-background "
                                        value={room.singleBeds}
                                    />
                                </div>
                            }
                        </div>
                        <div className="flex mb-1 justify-center">
                            <Button className="w-full">Salvar</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default AdminPage