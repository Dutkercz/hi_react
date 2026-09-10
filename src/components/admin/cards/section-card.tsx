import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormatCurrency } from '@/hooks/use-formart-currency'
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'


type SectionCardProps = {
    month: string
    year: string
    title: string | number
    badge: number

}

const SectionCard = (props: SectionCardProps) => {

    const formart = useFormatCurrency()

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Total de diárias em {props.month}/{props.year}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {formart(Number(props.title))}
                </CardTitle>
                <CardAction>
                    {props.badge > 0 ?
                        <Badge variant="outline" className='text-chart-1'>
                            <TrendingUpIcon />{props.badge} %
                        </Badge>
                        :
                        <Badge variant="outline" className='text-destructive'>
                            <TrendingDownIcon />{props.badge} %
                        </Badge>
                    }
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    numero a + de valor em diárias{" "}
                    <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                    em relação a mes x
                </div>
            </CardFooter>
        </Card>
    )
}

export default SectionCard