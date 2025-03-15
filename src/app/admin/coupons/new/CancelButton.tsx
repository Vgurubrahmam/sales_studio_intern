'use client'
import { Button } from "@/components/ui/button"

const CancelButton = () => {
    return (
        <Button variant="outline" type="button" onClick={() => history.back()}>
            Cancel
        </Button>
    )
}

export default CancelButton