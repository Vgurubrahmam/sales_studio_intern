import { requireAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Users, CheckCircle, Clock } from "lucide-react"

export default async function AdminDashboard() {
  // Ensure user is authenticated
  await requireAdmin()

  // Get dashboard stats
  const totalCoupons = await db.coupon.count()
  const activeCoupons = await db.coupon.count({
    where: { isActive: true },
  })
  const claimedCoupons = await db.claim.count()
  const uniqueUsers = await db.claim.groupBy({
    by: ["ipAddress"],
    _count: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your coupon distribution system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoupons}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeCoupons} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed Coupons</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimedCoupons}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCoupons > 0 ? Math.round((claimedCoupons / totalCoupons) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on unique IP addresses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Coupons</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoupons - claimedCoupons}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCoupons > 0 ? Math.round(((totalCoupons - claimedCoupons) / totalCoupons) * 100) : 0}% remaining
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

