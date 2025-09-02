import { cn } from "@/utils/cn"

const Loading = ({ className, rows = 5 }) => {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      <div className="animate-pulse">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-4 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-3 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading