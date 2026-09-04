import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item"
import { Spinner } from "../ui/spinner"

type SpinnerComProps = {
  title?: string
  message?: string
}

const SpinnerComp = (props: SpinnerComProps) => {
  return (
    <div className="flex min-h-56 w-full items-center justify-center p-6">
      <Item
        variant="outline"
        className="w-full max-w-sm justify-center gap-4 rounded-xl bg-card/80 px-5 py-4 shadow-sm backdrop-blur-sm"
      >
        <ItemMedia className="relative">
          <span className="absolute size-10 animate-ping rounded-full bg-primary/15" />
          <span className="relative flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Spinner className="size-5" />
          </span>
        </ItemMedia>
        <ItemContent className="min-w-0 gap-0.5">
          <ItemTitle className="w-full truncate text-sm">
            {props.title ?? "Carregando..."}
          </ItemTitle>
          <span className="text-xs text-muted-foreground">
            {props.message ?? "Aguarde um momento"}
          </span>
        </ItemContent>
      </Item>
    </div>
  )
}

export default SpinnerComp