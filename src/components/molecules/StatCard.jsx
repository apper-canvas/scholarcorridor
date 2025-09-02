import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  gradient = "from-primary to-secondary",
  className 
}) => {
  return (
    <Card className={cn("relative overflow-hidden group", className)}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}>
          <ApperIcon name={icon} className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold text-gray-900 font-display">{value}</div>
        {trend && (
          <div className="flex items-center mt-2">
            <ApperIcon 
              name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
              className={`w-4 h-4 mr-1 ${
                trend === "up" ? "text-success" : "text-error"
              }`} 
            />
            <span className={`text-sm font-medium ${
              trend === "up" ? "text-success" : "text-error"
            }`}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard