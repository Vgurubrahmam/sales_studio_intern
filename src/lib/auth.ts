
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { cookies } from "next/headers"

export async function getAdmin() {
  const cookie = await cookies()
  const adminId = cookie.get("admin_session")?.value
  console.log(adminId)

  if (!adminId) {
    return null
  }

  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId },
      select: { id: true, username: true },
    })

    return admin
  } catch (error) {
    console.error("Error fetching admin:", error)
    return null
  }
}

export async function requireAdmin() {
  const admin = await getAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  return admin
}

