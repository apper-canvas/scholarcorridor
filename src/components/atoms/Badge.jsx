import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    success: "bg-success/10 text-success border border-success/20",
    destructive: "bg-error/10 text-error border border-error/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    info: "bg-info/10 text-info border border-info/20",
    excellent: "grade-excellent",
    good: "grade-good",
    satisfactory: "grade-satisfactory",
    "needs-improvement": "grade-needs-improvement"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge