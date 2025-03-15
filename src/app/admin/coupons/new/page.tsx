

import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCoupon } from "@/lib/actions"
import CancelButton from "./CancelButton"

export default async function NewCouponPage() {
  // Ensure user is authenticated
  await requireAdmin()



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Coupon</h1>
        <p className="text-muted-foreground mt-2">Create a new coupon code for distribution</p>
      </div>

      <Card className="max-w-2xl">
        <form action={createCoupon}>
          <CardHeader>
            <CardTitle>Coupon Details</CardTitle>
            <CardDescription>Enter the information for the new coupon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input id="code" name="code" placeholder="e.g. SUMMER2023" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a description for this coupon"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <CancelButton />
            <Button type="submit">Create Coupon</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

