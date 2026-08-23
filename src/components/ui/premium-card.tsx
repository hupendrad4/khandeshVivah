"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pink" | "royal" | "gold"
  badge?: string
  floating?: boolean
}

const variantStyles = {
  pink: {
    border: "border-[#9B1B30]/20",
    gradient: "from-[#9B1B30]/5 via-white to-[#D4AF37]/5",
    shadow: "shadow-[#9B1B30]/10",
    badgeClass: "bg-[#9B1B30] text-white",
    accent: "text-[#9B1B30]",
  },
  royal: {
    border: "border-[#D4AF37]/20",
    gradient: "from-[#D4AF37]/5 via-white to-[#D4AF37]/5",
    shadow: "shadow-[#D4AF37]/10",
    badgeClass: "bg-[#D4AF37] text-white",
    accent: "text-[#D4AF37]",
  },
  gold: {
    border: "border-[#D4AF37]/20",
    gradient: "from-[#D4AF37]/5 via-white to-[#FFD700]/5",
    shadow: "shadow-[#D4AF37]/10",
    badgeClass: "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1B1C1C]",
    accent: "text-[#D4AF37]",
  },
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, children, variant = "gold", badge, floating = true, ...props }, ref) => {
    const v = variantStyles[variant]
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border-2 bg-gradient-to-br p-[2px] transition-all duration-300",
          "hover:shadow-xl",
          v.border,
          v.shadow,
          floating && "hover:-translate-y-1",
          className,
        )}
        {...props}
      >
        <div className={cn("relative h-full w-full rounded-xl bg-gradient-to-br p-6", v.gradient)}>
          {badge && (
            <Badge className={cn("absolute -top-3 right-4 px-4 py-1 text-xs font-bold shadow-lg", v.badgeClass)}>
              {badge}
            </Badge>
          )}
          {children}
        </div>
      </div>
    )
  },
)
PremiumCard.displayName = "PremiumCard"

export { PremiumCard, type PremiumCardProps }
