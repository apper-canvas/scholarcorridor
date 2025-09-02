import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-lg hover:shadow-xl hover:scale-105",
    accent: "bg-gradient-to-r from-accent to-amber-500 text-white hover:from-amber-600 hover:to-orange-500 shadow-lg hover:shadow-xl hover:scale-105",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white shadow-md hover:shadow-lg hover:scale-105",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/5 hover:scale-105",
    success: "bg-success text-white hover:bg-success/90 shadow-lg hover:shadow-xl hover:scale-105",
    destructive: "bg-error text-white hover:bg-error/90 shadow-lg hover:shadow-xl hover:scale-105"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 rounded-md px-3 text-sm",
    lg: "h-12 rounded-lg px-8 text-base",
    xl: "h-14 rounded-xl px-10 text-lg",
    icon: "h-10 w-10"
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button