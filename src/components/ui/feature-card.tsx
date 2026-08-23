"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  children: React.ReactNode
  className?: string
  icon: React.ElementType
  iconColor?: string
  iconBg?: string
  imageUrl?: string
  imageAlt?: string
  delay?: number
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, children, icon: Icon, iconColor = "text-[#9B1B30]", iconBg = "bg-[#9B1B30]/10", imageUrl, imageAlt = "", delay = 0 }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1 }}
        viewport={{ once: true }}
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300",
          "hover:shadow-elevated hover:-translate-y-1",
          className,
        )}
      >
        {/* Image section */}
        {imageUrl && (
          <div className="relative h-44 overflow-hidden">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Icon overlay */}
            <div className={cn(
              "absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow-lg",
              "transition-all duration-300 group-hover:scale-110",
            )}>
              <Icon className="h-5 w-5" style={{ color: iconColor.match(/#[a-fA-F0-9]{6}/)?.[0] || '#9B1B30' }} />
            </div>
          </div>
        )}

        {/* Content section */}
        <div className="relative z-10 p-6">
          {!imageUrl && (
            <div
              className={cn(
                "mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300",
                "group-hover:scale-110 group-hover:shadow-lg",
                iconBg,
              )}
            >
              <Icon className={cn("h-7 w-7 transition-transform duration-300 group-hover:scale-110", iconColor)} />
            </div>
          )}
          {children}
        </div>

        {/* Decorative background glow */}
        <div
          className={cn(
            "absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-0 transition-all duration-500",
            "group-hover:opacity-10 group-hover:scale-150",
            iconBg,
          )}
        />
      </motion.div>
    )
  },
)
FeatureCard.displayName = "FeatureCard"

export { FeatureCard }
