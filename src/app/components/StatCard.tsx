import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
}

export function StatCard({ title, value, description }: StatCardProps): React.ReactElement {
  return (
    <Card className="py-4 lg:py-6">
      <CardHeader>
        <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg lg:text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
