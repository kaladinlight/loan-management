import { Badge } from '@/app/components/ui/badge'
import { cn } from '@/lib/utils'

type LoanStatus = 'PENDING' | 'ACTIVE' | 'PAID' | 'DEFAULTED'

interface LoanStatusBadgeProps {
  status: LoanStatus
  className?: string
}

const statusConfig: Record<LoanStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  PAID: {
    label: 'Paid',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  DEFAULTED: {
    label: 'Defaulted',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
}

export function LoanStatusBadge({ status, className }: LoanStatusBadgeProps): React.ReactElement {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
