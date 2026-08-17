import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item"
import { Spinner } from "../ui/spinner"

type SpinnerComProps = {
    title?: string
    message?: string
}

const SpinnerComp = (props : SpinnerComProps) => {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{props.title?? "Carregando..."}</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-sm animate-pulse">{props.message?? "..."}</span>
        </ItemContent>
      </Item>
    </div>
  )
}

export default SpinnerComp