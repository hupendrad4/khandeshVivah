"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "pink" | "royal" | "gold" | "none"
  hoverEffect?: "glow" | "lift" | "border" | "none"
}

const gradientMap = {
  pink: "before:bg-gradient-to-br before:from-[#FF21A5] before:to-[#FF2E96]",
  royal: "before:bg-gradient-to-br before:from-[#002366] before:to-[#0047AB]",
  gold: "before:bg-gradient-to-br before:from-[#D4AF37] before:to-[#FFD700]",
  none: "before:bg-transparent",
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, gradient = "pink", hoverEffect = "glow", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-500",
            "before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-all before:duration-500",
            "after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition-all after:duration-500 after:blur-xl",
            gradientMap[gradient],
            hoverEffect === "glow" && "group-hover:before:opacity-100 group-hover:after:opacity-60",
            hoverEffect === "border" && "group-hover:before:opacity-100",
          )}
        />
        <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm border border-[#E5E7EB] shadow-card transition-all duration-300 group-hover:shadow-elevated group-hover:border-transparent h-full">
          {children}
        </div>
      </div>
    )
  },
)
GlassCard.displayName = "GlassCard"

export { GlassCard, type GlassCardProps }
