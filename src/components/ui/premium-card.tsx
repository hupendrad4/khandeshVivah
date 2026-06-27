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
    border: "border-[#FF21A5]/20",
    gradient: "from-[#FF21A5]/5 via-white to-[#FF2E96]/5",
    shadow: "shadow-[#FF21A5]/10",
    badgeClass: "bg-[#FF21A5] text-white",
    accent: "text-[#FF21A5]",
  },
  royal: {
    border: "border-[#002366]/20",
    gradient: "from-[#002366]/5 via-white to-[#0047AB]/5",
    shadow: "shadow-[#002366]/10",
    badgeClass: "bg-[#002366] text-white",
    accent: "text-[#002366]",
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
