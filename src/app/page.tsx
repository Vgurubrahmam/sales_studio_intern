import CouponClaim from "@/components/coupon-claim"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Coupon Giveaway</h1>
          <p className="text-muted-foreground mt-2">Claim your exclusive coupon code below</p>
        </div>
        <Link href={'/admin/login'}><Button variant={'outline'} className="my-2" size={'sm'}>Login as Admin</Button></Link>
        <CouponClaim />
      </div>
    </main>
  )
}

