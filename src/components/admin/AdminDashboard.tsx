//import { ChartArea } from "@/components/admin/ChartArea"
import AdminDashboardCard from "./AdminDashboardCard"
import ErrorComp from "../error/ErrorComp"
import { useDashboard } from "@/hooks/useDashboard"
import { Spinner } from "../ui/spinner"

const AdminDashboard = () => {
  const { monthlyResume, isLoading, isError, year, month, lastMonth, 
    percentageDailyRates, monthlyOccupationVariation} = useDashboard()

  if (isError) return <ErrorComp />
  if (isLoading || !monthlyResume) return <Spinner />

  return (
    <div>
      <div className="grid auto-rows-fr mb-2 grid-cols-1 items-stretch gap-3 px-4 
      *:monthlyResume-[slot=card]:bg-linear-to-t *:monthlyResume-[slot=card]:from-primary/5 *:monthlyResume-[slot=card]:to-card 
      *:monthlyResume-[slot=card]:shadow-xs md:grid-cols-3 lg:px-6 dark:*:monthlyResume-[slot=card]:bg-card">

        <AdminDashboardCard
          cardDescriptionMessage={"Valor total acumulado de diárias em " + month.toString().padStart(2, "0")}
          cardTitle={monthlyResume.totalMonthProfit}
          cardAction={monthlyResume.percentageChange}
          cardFooterActual={monthlyResume.totalMonthProfit}
          cardFooterLast={monthlyResume.lastMonthProfit}
          lastMonth={lastMonth}
          month={month.toString().padStart(2, "0")}
          year={year} />

        <AdminDashboardCard
          cardDescriptionMessage={"Total de diárias em " + month.toString().padStart(2, "0")}
          cardTitle={monthlyResume.actualMonthDailyRates.toString() + " Diárias"}
          cardAction={percentageDailyRates}
          cardFooterActual={monthlyResume.actualMonthDailyRates}
          cardFooterLast={monthlyResume.lastMonthDailyRates}
          lastMonth={lastMonth}
          month={month.toString().padStart(2, "0")}
          year={year} />

        <AdminDashboardCard
          cardDescriptionMessage={"Ocupação atual em " + month.toString().padStart(2, "0")}
          cardTitle={monthlyResume.percentageActualMonthlyOccupation.toString() + "%"}
          cardAction={monthlyOccupationVariation}
          cardFooterActual={monthlyResume.percentageActualMonthlyOccupation}
          cardFooterLast={monthlyResume.percentageLastMonthlyOccupation}
          lastMonth={lastMonth}
          month={month.toString().padStart(2, "0")}
          year={year} />
      </div>
      {/*
        <div className="px-4 lg:px-6">
          <ChartArea />
        </div>
      */}
    </div>
  )
}

export default AdminDashboard
