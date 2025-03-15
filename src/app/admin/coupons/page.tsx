import { requireAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import CouponActions from "@/components/coupon-actions"

export default async function CouponsPage() {
  // Ensure user is authenticated
  await requireAdmin()

  // Get all coupons with claim count
  const coupons = await db.coupon.findMany({
    include: {
      _count: {
        select: { claims: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap  items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground">Manage your coupon codes</p>
        </div>
        <Link href="/admin/coupons/new" className="max-sm:mt-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-fit">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Claims</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No coupons found. Add your first coupon to get started.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b">
                    <td className="p-4 align-middle font-mono">{coupon.code}</td>
                    <td className="p-4 align-middle">{coupon.description || "-"}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          coupon.isActive ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{coupon._count.claims}</td>
                    <td className="p-4 align-middle">{formatDate(coupon.createdAt)}</td>
                    <td className="p-4 align-middle text-right">
                      <CouponActions id={coupon.id} isActive={coupon.isActive} isClaimed={coupon._count.claims > 0} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

