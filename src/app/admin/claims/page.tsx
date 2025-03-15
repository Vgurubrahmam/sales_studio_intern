import { requireAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export default async function ClaimsPage() {
  // Ensure user is authenticated
  await requireAdmin()

  // Get all claims with coupon info
  const claims = await db.claim.findMany({
    include: {
      coupon: true,
    },
    orderBy: {
      claimedAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coupon Claims</h1>
        <p className="text-muted-foreground mt-2">View all claimed coupons and user information</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Coupon Code</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">IP Address</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Session ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User Agent</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Claimed At</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No claims found. Users haven&lsquo;t claimed any coupons yet.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="border-b">
                    <td className="p-4 align-middle font-mono">{claim.coupon.code}</td>
                    <td className="p-4 align-middle">{claim.ipAddress}</td>
                    <td className="p-4 align-middle">
                      <span className="truncate max-w-[150px] inline-block">{claim.sessionId}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="truncate max-w-[200px] inline-block">{claim.userAgent}</span>
                    </td>
                    <td className="p-4 align-middle">{formatDate(claim.claimedAt)}</td>
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

