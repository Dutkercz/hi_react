import type { RoomResponse, RoomUpdateRequest } from "@/api/room"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState, type BaseSyntheticEvent } from "react"
import { AlertDialogModal } from "../alert/alert"
import { AlertDialog } from "../ui/alert-dialog"
import { DialogTrigger } from "../ui/dialog"

type AdminRoomCardType = {
    room: RoomResponse
    onSubmit: (id: number, roomUpdate: RoomUpdateRequest) => void
}

const AdminRoomCard = ({ room, onSubmit }: AdminRoomCardType) => {

    const [singleBeds, setSingleBeds] = useState(room.singleBeds)
    const [doubleBeds, setDoubleBeds] = useState(room.doubleBeds)
    const [alertOpen, setAlertOpen] = useState(false)

    const handleSave = () => {
        onSubmit(room.id, {
            singleBeds: Number(singleBeds),
            doubleBeds: Number(doubleBeds)
        })
    }

    return (
        <div>
            <div className="flex-col m-1">
                <p className="text-center">Apartamento </p>
                <span
                    className="flex justify-center text-muted-foreground p-0.5 text-xl">
                    {room.roomNumber}
                </span>
            </div>
            <Separator className="text-center" />
            <div className="flex items-center justify-around gap-2 p-2">
                <div className="flex flex-col items-center justify-center">
                    <label htmlFor="singleBeds">Camas de solteiro</label>
                    <Input
                        id="singleBeds"
                        type="text"
                        className="w-20 text-center mt-2 border rounded-sm p-1.5 bg-background "
                        value={singleBeds}
                        onChange={(e: BaseSyntheticEvent) => setSingleBeds(e.target.value)}
                    />
                </div>

                <Separator orientation="vertical" className="ml-5" />

                <div className="flex flex-col items-center justify-center">
                    <label htmlFor="doubleBeds">Cama de casal</label>
                    <Input
                        id="doubleBeds"
                        type="text"
                        className="w-20 text-center mt-2 border rounded-sm p-1.5 bg-background"
                        value={doubleBeds}
                        onChange={(e: BaseSyntheticEvent) => setDoubleBeds(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex mb-1 justify-center">
                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                    <DialogTrigger render={
                        <Button className="flex-1"
                        >
                            Atualizar
                        </Button>
                    } />
                    <AlertDialogModal key={room.id} isOpen={setAlertOpen} onConfirm={handleSave} title='Atualizar Apartamento'
                        message={`Deseja atualizar a configuração do apartamento ${room.roomNumber}`} />
                </AlertDialog>
            </div>
        </div>
    )
}

export default AdminRoomCard