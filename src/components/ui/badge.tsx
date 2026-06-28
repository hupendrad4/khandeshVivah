import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#8f4e00]/10 text-[#693800] border border-[#8f4e00]/20",
        secondary: "bg-[#435b9f]/10 text-[#435b9f] border border-[#435b9f]/20",
        premium: "bg-gradient-to-r from-[#d3ae36]/20 to-[#FFD700]/20 text-[#735C00] border border-[#d3ae36]/30",
        success: "bg-[#50C878]/10 text-[#1a7a3f] border border-[#50C878]/20",
        destructive: "bg-red-100 text-red-700 border border-red-200",
        outline: "text-[#554336] border border-[#E4E2E1]",
        verified: "bg-blue-100 text-blue-700 border border-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
