import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"

type TooltipComponentProps = {
    tooltipContent: ReactNode
    hover: ReactNode
}

const TooltipComponent = ({ tooltipContent, hover }: TooltipComponentProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger render={<Button variant="ghost">{hover}</Button>} />
                <TooltipContent>
                    <p>{tooltipContent}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default TooltipComponent