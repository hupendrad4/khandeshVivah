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
    border: "border-[#8f4e00]/20",
    gradient: "from-[#8f4e00]/5 via-white to-[#ff9933]/5",
    shadow: "shadow-[#8f4e00]/10",
    badgeClass: "bg-[#8f4e00] text-white",
    accent: "text-[#8f4e00]",
  },
  royal: {
    border: "border-[#435b9f]/20",
    gradient: "from-[#435b9f]/5 via-white to-[#435b9f]/5",
    shadow: "shadow-[#435b9f]/10",
    badgeClass: "bg-[#435b9f] text-white",
    accent: "text-[#435b9f]",
  },
  gold: {
    border: "border-[#d3ae36]/20",
    gradient: "from-[#d3ae36]/5 via-white to-[#FFD700]/5",
    shadow: "shadow-[#d3ae36]/10",
    badgeClass: "bg-gradient-to-r from-[#d3ae36] to-[#FFD700] text-[#1B1C1C]",
    accent: "text-[#d3ae36]",
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
