import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardContent } from "@/components/atoms/Card"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item",
  icon = "Inbox",
  action,
  actionText = "Add Item",
  className 
}) => {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 shadow-lg">
          <ApperIcon name={icon} className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {action && (
          <Button onClick={action} variant="accent" className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>{actionText}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Empty