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
import { useDashboard } from "../../hooks/useDashboard"
import { useFormatCurrency } from "@/hooks/useFormatCurrency"

const AdminDashboardCard = () => {

  const format = useFormatCurrency()
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const lastMonth = new Date().getMonth().toString().padStart(2, "0")
  const { data, isLoading, isError } = useDashboard(year, month)

  if (isError) return <><h1>Erro</h1></>
  if (isLoading || !data) return <Spinner />

  const percentageDailyRates = // calculo de diferença percentual entre 2 valores .
    ((data.actualMonthDailyRates - data.lastMonthDailyRates) / data.lastMonthDailyRates) * 100

  return (
    <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-3 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card h-full min-w-0">
        <CardHeader className="min-h-32">
          <CardDescription>
            Valor total acumulado de diárias em {month.toString().padStart(2, "0")}/{year}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {format(data.totalMonthProfit)}
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
        <CardFooter className="mt-auto min-h-20 flex-col items-start gap-1.5 text-sm">
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
      <Card className="@container/card h-full min-w-0">
        <CardHeader className="min-h-32">
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
                {percentageDailyRates.toFixed(2)} %
              </Badge>
              :
              <Badge variant="outline" className='text-destructive'>
                <TrendingDownIcon />
                {percentageDailyRates.toFixed(2)} %
              </Badge>
            }
          </CardAction>
        </CardHeader>
        <CardFooter className="mt-auto min-h-20 flex-col items-start gap-1.5 text-sm">
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

      <Card className="@container/card h-full min-w-0">
        <CardHeader className="min-h-32">
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
        <CardFooter className="mt-auto min-h-20">

        </CardFooter>
      </Card>
    </div>
  )
}

export default AdminDashboardCard
