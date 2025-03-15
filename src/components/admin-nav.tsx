"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { adminLogout } from "@/lib/actions"
import { Layers, Users, LayoutDashboard, LogOut, Menu } from "lucide-react"

export default function AdminNav({ username }: { username: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavOpen, setIsNavOpen] = useState(false)

  const handleLogout = async () => {
    await adminLogout()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-semibold text-lg">
            Coupon Admin
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <nav className={`md:flex items-center gap-6 ${isNavOpen ? "block" : "hidden"}`}>
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/admin" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </div>
            </Link>
            <Link
              href="/admin/coupons"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/admin/coupons" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Coupons
              </div>
            </Link>
            <Link
              href="/admin/claims"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/admin/claims" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Claims
              </div>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            Logged in as <span className="font-medium text-foreground">{username}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

