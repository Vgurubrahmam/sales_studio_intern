"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { claimCoupon } from "@/lib/actions"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function CouponClaim() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    couponCode?: string
  } | null>(null)

  const handleClaim = async () => {
    setIsLoading(true)
    try {
      const response = await claimCoupon()
      setResult(response)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Your Coupon</CardTitle>
        <CardDescription>Get a unique coupon code that you can use for your next purchase.</CardDescription>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="flex flex-col items-center text-center gap-4">
            {result.success ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div>
                  <p className="font-medium text-lg">{result.message}</p>
                  {result.couponCode && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground mb-1">Your coupon code:</p>
                      <p className="font-mono font-bold text-xl">{result.couponCode}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-12 w-12 text-amber-500" />
                <p className="font-medium">{result.message}</p>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="mb-4">Click the button below to claim your coupon code.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {!result?.success && (
          <Button onClick={handleClaim} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Claim Coupon"
            )}
          </Button>
        )}
        {result?.success && (
          <Button onClick={() => setResult(null)} variant="outline" className="w-full">
            Claim Another
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

