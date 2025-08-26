  "use client"

  import { useState, useEffect } from "react"
  import { useRouter } from "next/navigation"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { LogOut, Calendar, ShoppingBag, GraduationCap, Users, Download } from "lucide-react"
  import type { AdminSession } from "@/lib/admin-auth"
  import { EventsManagement } from "./events-management"
  import { MerchManagement } from "./merch-management"
  import { CollegesManagement } from "./colleges-management"
  import { Badge } from "@/components/ui/badge"

  interface AdminDashboardProps {
    session: AdminSession
  }

  interface DashboardStats {
    totalEvents: number
    totalMerch: number
    totalColleges: number
    totalRegistrations: number
  }

  export function AdminDashboard({ session }: AdminDashboardProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [exportingRegistrations, setExportingRegistrations] = useState(false)
    const [exportingMerch, setExportingMerch] = useState(false)
    const [stats, setStats] = useState<DashboardStats>({
      totalEvents: 0,
      totalMerch: 0,
      totalColleges: 0,
      totalRegistrations: 0,
    })
    const [orders, setOrders] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
      fetchStats()
      fetchOrders()
    }, [])

    const fetchStats = async () => {
      try {
        const [eventsRes, merchRes, collegesRes] = await Promise.all([
          fetch("/api/admin/events"),
          fetch("/api/admin/merch"),
          fetch("/api/admin/colleges"),
        ])

        const [events, merch, colleges] = await Promise.all([eventsRes.json(), merchRes.json(), collegesRes.json()])

        const totalRegistrations = events.reduce((sum: number, event: any) => sum + (event.registrations?.length || 0), 0)

        setStats({
          totalEvents: events.length,
          totalMerch: merch.length,
          totalColleges: colleges.length,
          totalRegistrations,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    const handleExportRegistrations = async () => {
      setExportingRegistrations(true)
      try {
        console.log("[v0] Starting registrations export...")
        const response = await fetch("/api/admin/export/registrations")
        console.log("[v0] Export response status:", response.status)
        console.log(response)
        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `RANN-NEETI-Registrations-${new Date().toISOString().split("T")[0]}.xlsx`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          console.log("[v0] Registrations export completed successfully")
        } else {
          console.error("[v0] Export failed with status:", response.status)
          const errorText = await response.text()
          console.error("[v0] Error details:", errorText)
        }
      } catch (error) {
        console.error("[v0] Error exporting registrations:", error)
      } finally {
        setExportingRegistrations(false)
      }
    }

    const handleExportMerch = async () => {
      setExportingMerch(true)
      try {
        console.log("[v0] Starting merchandise orders export...")
        const response = await fetch("/api/admin/export/merch")
        console.log("[v0] Merch export response status:", response.status)

        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `RANN-NEETI-Merchandise-Orders-${new Date().toISOString().split("T")[0]}.xlsx`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          console.log("[v0] Merchandise orders export completed successfully")
        } else {
          console.error("[v0] Merch export failed with status:", response.status)
          const errorText = await response.text()
          console.error("[v0] Error details:", errorText)
        }
      } catch (error) {
        console.error("[v0] Error exporting merchandise orders:", error)
      } finally {
        setExportingMerch(false)
      }
    }

    const handleLogout = async () => {
      setIsLoggingOut(true)
      try {
        await fetch("/api/admin/logout", { method: "POST" })
        router.push("/admin/login")
        router.refresh()
      } catch (error) {
        console.error("Logout error:", error)
      } finally {
        setIsLoggingOut(false)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                  RANN-NEETI
                </h1>
                <span className="text-slate-400">Admin Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportRegistrations}
                  disabled={exportingRegistrations}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exportingRegistrations ? "Exporting..." : "Export Registrations"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportMerch}
                  disabled={exportingMerch}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exportingMerch ? "Exporting..." : "Export Orders"}
                </Button>
                <span className="text-sm text-slate-400">Welcome, {session.username}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-200">{stats.totalEvents}</div>
                <p className="text-xs text-slate-500">Events created</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Merchandise</CardTitle>
                <ShoppingBag className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-200">{stats.totalMerch}</div>
                <p className="text-xs text-slate-500">Items available</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Colleges</CardTitle>
                <GraduationCap className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-200">{stats.totalColleges}</div>
                <p className="text-xs text-slate-500">Registered colleges</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Registrations</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-200">{stats.totalRegistrations}</div>
                <p className="text-xs text-slate-500">Total participants</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="events" className="data-[state=active]:bg-slate-700 text-slate-300">
                Events Management
              </TabsTrigger>
              <TabsTrigger value="merch" className="data-[state=active]:bg-slate-700 text-slate-300">
                Merchandise
              </TabsTrigger>
              <TabsTrigger value="colleges" className="data-[state=active]:bg-slate-700 text-slate-300">
                Colleges
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-slate-700 text-slate-300">
                Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <EventsManagement />
            </TabsContent>

            <TabsContent value="merch">
              <MerchManagement />
            </TabsContent>

            <TabsContent value="colleges">
              <CollegesManagement />
            </TabsContent>

            <TabsContent value="orders">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Merchandise Orders</CardTitle>
                  <CardDescription className="text-slate-400">View and manage all merchandise orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-slate-300">No orders yet</h3>
                      <p className="text-slate-500">Orders will appear here when users place them</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900/30"
                        >
                          <div>
                            <h3 className="font-semibold text-slate-200">{order.title}</h3>
                            <p className="text-sm text-slate-400">
                              Customer: {order.user.name} ({order.user.email})
                            </p>
                            <p className="text-sm text-slate-400">
                              Size: {order.size} | College: {order.user.collegeName}
                            </p>
                            <p className="text-sm text-slate-400">
                              Ordered: {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-200">₹{order.price}</p>
                            <Badge
                              variant={order.status === "delivered" ? "default" : "secondary"}
                              className="bg-slate-700 text-slate-300"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  }
