import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardContent } from "@/components/atoms/Card"

const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="flex items-center space-x-2">
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Error