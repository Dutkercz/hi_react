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
import { ChartNoAxesCombined, TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { useDashboard } from "./useDashboard"
import { useFormatCurrency } from "@/hooks/use-formart-currency"

export function SectionCards() {

  const format = useFormatCurrency()
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const lastMonth = new Date().getMonth().toString().padStart(2, "0")
  const { data, isLoading, isError } = useDashboard(year, month)

  const percentageDailyRates = ((data!.actualMonthDailyRates - data!.lastMonthDailyRates) / data!.lastMonthDailyRates) * 100

  if (isLoading || !data) return <Spinner />
  if (isError) return <><h1>Erro</h1></>

  return (
    <div className="grid grid-cols-1 gap-3 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            Total de diárias em {month.toString().padStart(2, "0")}/{year}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {format(Number(data.totalMonthProfit))}
          </CardTitle>
          <CardAction>
            {data.percentageChange > 0 ?
              <Badge variant="outline" className='text-chart-1'>
                <TrendingUpIcon />{data.percentageChange} %
              </Badge>
              :
              <Badge variant="outline" className='text-destructive'>
                <TrendingDownIcon />{data.percentageChange} %
              </Badge>
            }
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {data.totalMonthProfit > data.lastMonthProfit ?
            <div className="line-clamp-1 flex gap-2 font-medium">
              Aumento de {format(data.totalMonthProfit - data.lastMonthProfit)}
              <TrendingUpIcon className="size-4" />
            </div>
            :
            <div className="line-clamp-1 flex gap-2 font-medium">
              Redução de {format(data.totalMonthProfit - data.lastMonthProfit)}
              <TrendingDownIcon className="size-4" />
            </div>
          }
          <div className="text-muted-foreground">
            em relação a {lastMonth}/{year.toString()}
          </div>
        </CardFooter>

      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de diárias em {month.toString().padStart(2, "0")}/{year}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <div className="flex items-center gap-2">
              <ChartNoAxesCombined />
              {data.actualMonthDailyRates}
            </div>
          </CardTitle>
          <CardAction>
            {percentageDailyRates > 0 ?
              <Badge variant="outline" className='text-chart-1'>
                <TrendingUpIcon
                />
                {percentageDailyRates} %
              </Badge>
              :
              <Badge variant="outline" className='text-destructive'>
                <TrendingDownIcon />
                {percentageDailyRates} %
              </Badge>
            }
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {data.actualMonthDailyRates > data.lastMonthDailyRates ?
            <div className="line-clamp-1 flex gap-2 font-medium">
              Total de {data.actualMonthDailyRates - data.lastMonthDailyRates} diárias a mais
              <TrendingUpIcon className="size-4" />
            </div>
            :
            <div className="line-clamp-1 flex gap-2 font-medium">
              Redução de {format(data.totalMonthProfit - data.lastMonthProfit)}
              <TrendingDownIcon className="size-4" />
            </div>
          }
          <div className="text-muted-foreground">
            em relação a {lastMonth}/{year.toString()}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Ocupação parcial em {month.toString().padStart(2, "0")}/{year}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <div className="flex items-center gap-2">
              <ChartNoAxesCombined />
              {data.percentageActualMonthlyOccupation} %
            </div>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>

        </CardFooter>
      </Card>
    </div>
  )
}
