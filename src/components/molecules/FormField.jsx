import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  id, 
  error, 
  className, 
  required,
  ...inputProps 
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className={cn(required && "after:content-['*'] after:text-error after:ml-1")}>
        {label}
      </Label>
      <Input
        id={id}
        className={cn(
          error && "border-error focus:border-error focus:ring-error/20"
        )}
        {...inputProps}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField