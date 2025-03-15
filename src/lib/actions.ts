"use server"

import { cookies, headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { z } from "zod"
import { redirect } from "next/navigation"

// Cooldown period in milliseconds (1 hour)
const COOLDOWN_PERIOD = 60 * 60 * 1000

export async function getClientIp() {
  'use server'
  const headersList = await headers()

  // Try to get IP from various headers
  const forwardedFor = headersList.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  const realIp = headersList.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  // Fallback
  return "unknown"
}

export async function claimCoupon() {
  try {
    // Get client IP and set a cookie to track browser session
    const ip = await getClientIp()
    const cookieStore = await cookies()
    let sessionId = cookieStore.get("session_id")?.value

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      cookieStore.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    }

    // Check if user has claimed a coupon recently
    const recentClaim = await db.claim.findFirst({
      where: {
        OR: [{ ipAddress: ip }, { sessionId: sessionId }],
        claimedAt: {
          gte: new Date(Date.now() - COOLDOWN_PERIOD),
        },
      },
      include: {
        coupon: true,
      },
    })

    if (recentClaim) {
      const timeLeft = Math.ceil((COOLDOWN_PERIOD - (Date.now() - recentClaim.claimedAt.getTime())) / (60 * 1000))
      return {
        success: false,
        message: `You've already claimed a coupon. Please try again in ${timeLeft} minutes.`,
        couponCode: recentClaim.coupon.code,
      }
    }

    // Find an available coupon that hasn't been claimed yet
    const availableCoupon = await db.coupon.findFirst({
      where: {
        isActive: true,
        claims: {
          none: {},
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    if (!availableCoupon) {
      return {
        success: false,
        message: "Sorry, all coupons have been claimed. Please check back later.",
      }
    }

    // Record the claim
    await db.claim.create({
      data: {
        couponId: availableCoupon.id,
        ipAddress: ip || "unknown",
        sessionId,
        userAgent: (await headers()).get("user-agent") || "unknown",
      },
    })

    return {
      success: true,
      message: "Congratulations! You've successfully claimed a coupon.",
      couponCode: availableCoupon.code,
    }
  } catch (error) {
    console.error("Error claiming coupon:", error)
    return {
      success: false,
      message: "An error occurred while claiming your coupon. Please try again later.",
    }
  }
}

export async function addCoupon(formData: FormData) {
  const schema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters"),
    description: z.string().optional(),
  })

  try {
    const parsed = schema.parse({
      code: formData.get("code"),
      description: formData.get("description") || "",
    })

    await db.coupon.create({
      data: {
        code: parsed.code,
        description: parsed.description,
        isActive: true,
      },
    })

    revalidatePath("/admin/coupons")
    return { success: true }
  } catch (error) {
    console.error("Error adding coupon:", error)
    return { success: false, error: "Failed to add coupon" }
  }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  try {
    await db.coupon.update({
      where: { id },
      data: { isActive },
    })

    revalidatePath("/admin/coupons")
    return { success: true }
  } catch (error) {
    console.error("Error toggling coupon status:", error)
    return { success: false, error: "Failed to update coupon" }
  }
}

export async function deleteCoupon(id: string) {
  try {
    // Check if coupon has been claimed
    const coupon = await db.coupon.findUnique({
      where: { id },
      include: { claims: true },
    })

    if (coupon?.claims.length) {
      return {
        success: false,
        error: "Cannot delete a coupon that has been claimed",
      }
    }

    await db.coupon.delete({
      where: { id },
    })

    revalidatePath("/admin/coupons")
    return { success: true }
  } catch (error) {
    console.error("Error deleting coupon:", error)
    return { success: false, error: "Failed to delete coupon" }
  }
}

export async function adminLogin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  try {
    const admin = await db.admin.findUnique({
      where: { username },
    })

    if (!admin) {
      return { success: false, error: "Invalid credentials" }
    }

    const passwordMatch = admin.password === password
    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials" }
    }

    // Set admin session cookie
    (await cookies()).set("admin_session", admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function adminLogout() {
  (await cookies()).delete("admin_session")
  return { success: true }
}

export async function getCoupon() {
  return null
}

export async function createCoupon(formData: FormData) {
  const result = await addCoupon(formData)
  if (result.success) {
    redirect("/admin/coupons")
  }
}

