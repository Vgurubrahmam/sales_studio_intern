import { redirect } from "next/navigation"
import { getAdmin } from "@/lib/auth"
import LoginForm from "@/components/login-form"

export default async function LoginPage() {
  // If already logged in, redirect to admin dashboard
  const admin = await getAdmin()
  if (admin) {
    redirect("/admin")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Sign in to access the coupon management system</p>
          <p className="text-muted-foreground text-xs">{'Hint > username : guru ; password : guru12345'}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

