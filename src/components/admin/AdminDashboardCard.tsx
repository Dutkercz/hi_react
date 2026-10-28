"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartNoAxesCombined, EqualApproximately, TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { useFormatCurrency } from "@/hooks/useFormatCurrency"

type AdminDashboardCardProps = {
  cardDescriptionMessage: string
  cardTitle: number | string
  cardAction: number
  cardFooterActual: number
  cardFooterLast: number
  lastMonth: string
  year: number
  month: string
}

const AdminDashboardCard = ({ cardDescriptionMessage, cardTitle, cardAction,
  cardFooterActual, cardFooterLast, lastMonth, year }: AdminDashboardCardProps) => {

  const format = useFormatCurrency()

  return (
    
      <Card className="@container/card h-full min-w-0">
        <CardHeader className="min-h-32">
          <CardDescription>
            {cardDescriptionMessage}/{year}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {typeof cardTitle === "string" ?
              <div className="flex items-center gap-2">
                <ChartNoAxesCombined />
                {cardTitle}
              </div>
              : format(Number(cardTitle))}

          </CardTitle>
          <CardAction>
            {cardAction > 0 ?
              <Badge variant="outline" className='text-chart-1'>
                <TrendingUpIcon /> +{cardAction.toFixed(2)} %
              </Badge>
              :
              cardAction < 0 ?
                <Badge variant="outline" className='text-destructive'>
                  <TrendingDownIcon />{cardAction.toFixed(2)} %
                </Badge>
                :
                <Badge variant="outline">
                  <EqualApproximately />{cardAction.toFixed(2)} %
                </Badge>
            }
          </CardAction>
        </CardHeader>
        <CardFooter className="mt-auto min-h-20 flex-col items-start gap-1.5 text-sm">
          {cardFooterActual > cardFooterLast ?
            //case >
            <div className="line-clamp-1 flex gap-2 font-medium">
              Aumento de {typeof cardTitle === "string" ?
                cardFooterActual - cardFooterLast
                :
                format(cardFooterActual - cardFooterLast)}
              <TrendingUpIcon className="size-4" />
            </div>
            :
            //case <
            cardFooterActual < cardFooterLast ?
              <div className="line-clamp-1 flex gap-2 font-medium">
                Redução de {typeof cardTitle === "string" ?
                  cardFooterActual - cardFooterLast
                  :
                  format(cardFooterActual - cardFooterLast)}
                <TrendingDownIcon className="size-4" />
              </div>
              :
              //case equals
              <div className="line-clamp-1 flex gap-2 font-medium">
                {typeof cardTitle === "string" ?
                  cardFooterActual - cardFooterLast
                  :
                  format(cardFooterActual - cardFooterLast)}
                <EqualApproximately className="size-4" />
              </div>
          }
          <div className="text-muted-foreground">
            em relação a {lastMonth}/{year.toString()}
          </div>
        </CardFooter>

      </Card>  )
}

export default AdminDashboardCard
