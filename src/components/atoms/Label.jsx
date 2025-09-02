import React from "react"
import { cn } from "@/utils/cn"

const Label = React.forwardRef(({ 
  className, 
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5 block",
        className
      )}
      {...props}
    />
  )
})

Label.displayName = "Label"

export default Label