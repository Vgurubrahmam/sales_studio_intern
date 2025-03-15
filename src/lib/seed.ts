import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminExists = await prisma.admin.findUnique({
    where: { username: "admin" },
  })

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await prisma.admin.create({
      data: {
        username: "admin",
        password: hashedPassword,
      },
    })
    console.log("Admin user created")
  }

  // Create sample coupons
  const sampleCoupons = [
    { code: "WELCOME10", description: "10% off your first purchase" },
    { code: "SUMMER2023", description: "Summer sale discount" },
    { code: "FREESHIP", description: "Free shipping on orders over $50" },
    { code: "HOLIDAY25", description: "25% off holiday items" },
    { code: "FLASH50", description: "50% off flash sale" },
  ]

  for (const coupon of sampleCoupons) {
    const exists = await prisma.coupon.findUnique({
      where: { code: coupon.code },
    })

    if (!exists) {
      await prisma.coupon.create({
        data: coupon,
      })
      console.log(`Created coupon: ${coupon.code}`)
    }
  }

  console.log("Seed completed successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

