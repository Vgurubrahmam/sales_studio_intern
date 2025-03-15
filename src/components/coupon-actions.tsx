"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toggleCouponStatus, deleteCoupon } from "@/lib/actions"
import { MoreHorizontal, Power, PowerOff, Trash } from "lucide-react"
import {toast} from 'sonner'

interface CouponActionsProps {
  id: string
  isActive: boolean
  isClaimed: boolean
}

export default function CouponActions({ id, isActive, isClaimed }: CouponActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleStatus = async () => {
    setIsLoading(true)
    const result = await toggleCouponStatus(id, !isActive)
    setIsLoading(false)

    if (result.success) {
      toast.success(isActive ? "Coupon deactivated" : "Coupon activated", {description : `The coupon has been ${isActive ? "deactivated" : "activated"} successfully.`})
    } else {
      toast.warning('Error', {description : result.error || "Failed to update coupon status"})
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const result = await deleteCoupon(id)
    setIsLoading(false)
    setIsDeleteDialogOpen(false)

    if (result.success) {
      
      toast.success('Coupon deleted.', {description : "The coupon has been deleted successfully."})
    } else {
      toast.warning('Error', {description : result.error || "Failed to delete coupon"})
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleToggleStatus} disabled={isLoading}>
            {isActive ? (
              <>
                <PowerOff className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading || isClaimed}
            className={isClaimed ? "text-muted-foreground" : "text-destructive"}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

