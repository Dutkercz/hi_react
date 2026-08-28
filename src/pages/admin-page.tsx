import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { SidebarProvider } from '@/components/ui/sidebar'
import { axiosService } from '@/lib/axios'
import React, { useEffect, useState } from 'react'


const AdminPage = () => {

    const [data, setData] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosService.get("/admin/month-resume?year=2026&month=8")
            setData(() => response.data)

        }
        fetchData()

    }, [])


  return (
    <div>
         <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    ></SidebarProvider>
        <Card>
            <CardTitle>Total em diária do mes</CardTitle>
            <div>
                <CardContent>
                    <div>
                        <p>Valor acumulado no mes: {data.toFixed(2)}</p>

                    </div>
                </CardContent>
            </div>
        </Card>
    </div>
  )
}

export default AdminPage