import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="mb-4 rounded-full bg-[#9B1B30]/5 p-4">
        {icon || <Heart className="h-12 w-12 text-[#9B1B30]/40" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[#1b1c1c]">{title}</h3>
      {description && <p className="mb-6 max-w-md text-sm text-[#5C4B4D]">{description}</p>}
      {action}
    </div>
  )
}
