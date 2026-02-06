'use client'

import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog'
import { deleteLoan } from '@/lib/actions/loan'

interface DeleteLoanDialogProps {
  loanId: string
  loanNumber: string
}

export function DeleteLoanDialog({ loanId, loanNumber }: DeleteLoanDialogProps): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (): void => {
    startTransition(async () => {
      try {
        await deleteLoan(loanId)
      } catch (error) {
        if (isRedirectError(error)) {
          toast.success(`Loan ${loanNumber} deleted successfully`)
          throw error
        }
        toast.error('Failed to delete loan')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Loan</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete loan <strong>{loanNumber}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
