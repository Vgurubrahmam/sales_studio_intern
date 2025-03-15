import type React from "react"
import { getAdmin } from "@/lib/auth"
import AdminNav from "@/components/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      {admin && <AdminNav username={admin.username} />}
      <div className="container mx-auto p-4 pt-20">{children}</div>
    </div>
  )
}

