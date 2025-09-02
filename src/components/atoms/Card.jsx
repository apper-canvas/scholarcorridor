import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ 
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
        className
      )}
      {...props}
    />
  )
})

const CardHeader = React.forwardRef(({ 
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
})

const CardTitle = React.forwardRef(({ 
  className, 
  ...props 
}, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-bold leading-none tracking-tight text-gray-900 font-display",
        className
      )}
      {...props}
    />
  )
})

const CardContent = React.forwardRef(({ 
  className, 
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn("p-6 pt-0", className)} 
      {...props} 
    />
  )
})

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }