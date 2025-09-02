import Badge from "@/components/atoms/Badge"

const GradePill = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100
  
  const getVariant = (percentage) => {
    if (percentage >= 90) return "excellent"
    if (percentage >= 80) return "good"
    if (percentage >= 70) return "satisfactory"
    return "needs-improvement"
  }

  const getLabel = (percentage) => {
    if (percentage >= 90) return "Excellent"
    if (percentage >= 80) return "Good"
    if (percentage >= 70) return "Satisfactory"
    return "Needs Improvement"
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="text-sm font-semibold text-gray-900">
        {score}/{maxScore}
      </div>
      <Badge variant={getVariant(percentage)}>
        {getLabel(percentage)}
      </Badge>
    </div>
  )
}

export default GradePill