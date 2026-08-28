import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Dispatch, SetStateAction } from "react"

type AlertDialogModalProps = {
  onConfirm: (stayId: number) => void
  title: string
  message?: string
  isOpen: Dispatch<SetStateAction<boolean>>
  id?: number
}

export function AlertDialogModal({ id, isOpen, onConfirm, title, message }: AlertDialogModalProps) {

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {message ?? "Essa ação não pode ser desfeita. Deseja realmente continuar?"}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={() => {
          isOpen(false)
          onConfirm(id ?? -1)
        }
        }>Confirmar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
