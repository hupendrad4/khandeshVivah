import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#8f4e00] text-white hover:bg-[#6d3a00] shadow-sm hover:shadow-md hover:shadow-[#8f4e00]/20",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[#435b9f]/20 bg-transparent text-[#435b9f] hover:bg-[#435b9f]/5 hover:border-[#435b9f]/40",
        secondary: "bg-[#435b9f] text-white hover:bg-[#001a4d] shadow-sm",
        ghost: "hover:bg-[#8f4e00]/10 text-[#554336] hover:text-[#8f4e00]",
        link: "text-[#8f4e00] underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-[#d3ae36] via-[#FFD700] to-[#d3ae36] text-[#1B1C1C] hover:brightness-110 shadow-md",
        gold: "border border-[#d3ae36] bg-transparent text-[#d3ae36] hover:bg-[#d3ae36]/10",
        glass: "bg-white/80 backdrop-blur-sm border border-white/50 text-[#1b1c1c] hover:bg-white/90 hover:border-[#8f4e00]/30 shadow-sm hover:shadow-[#8f4e00]/10",
        slide: "relative overflow-hidden bg-[#8f4e00] text-white before:absolute before:inset-0 before:-translate-x-full before:bg-white/20 before:transition-transform before:duration-300 hover:before:translate-x-0 hover:bg-[#6d3a00]",
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
