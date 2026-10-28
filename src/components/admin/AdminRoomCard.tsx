import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState, type BaseSyntheticEvent } from "react"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import type { RoomResponse, RoomUpdateRequest } from "@/types/room"
import AlertDialogModal from "../alert/AlertDialogModal"
import { Trash2 } from "lucide-react"
import { CardTitle } from "../ui/card"
type AdminRoomCardType = {
  room: RoomResponse
  onSubmitEdit: (id: number, roomUpdate: RoomUpdateRequest) => void
  onSubmitDelete: (id: number) => void
}

const AdminRoomCard = ({ room, onSubmitEdit, onSubmitDelete }: AdminRoomCardType) => {

  const [singleBeds, setSingleBeds] = useState(room.singleBeds)
  const [doubleBeds, setDoubleBeds] = useState(room.doubleBeds)
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-baseline m-2">
        <CardTitle>Apartamento </CardTitle>
        <span
          className="text-muted-foreground mr-14 text-xl">
          {room.roomNumber}
        </span>
        <div className="mr-6 p-1">
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger nativeButton={false} render={
              <Button variant="destructive">
                <Trash2 size="16" />
              </Button>
            } />

            <AlertDialogModal key={room.id} isOpen={setDeleteOpen} onConfirm={() => onSubmitDelete(room.id)} title='Deletar Apartamento'
              message={`Deseja excluir o apartamento ${room.roomNumber}`} />
          </AlertDialog>
        </div>
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

        <Separator orientation="vertical" className="mr-5" />

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
            <Button className="flex-2"
            >
              Atualizar
            </Button>
          } />
          <AlertDialogModal key={room.id} isOpen={setAlertOpen} onConfirm={() => onSubmitEdit(room.id, {
            singleBeds: Number(singleBeds),
            doubleBeds: Number(doubleBeds)
          })} title='Atualizar Apartamento'
            message={`Deseja atualizar a configuração do apartamento ${room.roomNumber}`} />
        </AlertDialog>
      </div>
    </div >
  )
}

export default AdminRoomCard