import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#FF21A5] text-white hover:bg-[#E61E94] shadow-sm hover:shadow-md hover:shadow-[#FF21A5]/20",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[#002366]/20 bg-transparent text-[#002366] hover:bg-[#002366]/5 hover:border-[#002366]/40",
        secondary: "bg-[#002366] text-white hover:bg-[#001a4d] shadow-sm",
        ghost: "hover:bg-[#FF21A5]/10 text-[#554336] hover:text-[#FF21A5]",
        link: "text-[#FF21A5] underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-[#1B1C1C] hover:brightness-110 shadow-md",
        gold: "border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#D4AF37]/10",
        glass: "bg-white/80 backdrop-blur-sm border border-white/50 text-[#1b1c1c] hover:bg-white/90 hover:border-[#FF21A5]/30 shadow-sm hover:shadow-[#FF21A5]/10",
        slide: "relative overflow-hidden bg-[#FF21A5] text-white before:absolute before:inset-0 before:-translate-x-full before:bg-white/20 before:transition-transform before:duration-300 hover:before:translate-x-0 hover:bg-[#E61E94]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
