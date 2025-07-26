import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 bg-gradient-to-r transition-all duration-500 ease-out",
            percentage >= 80 ? "from-green-400 to-green-600" :
            percentage >= 60 ? "from-blue-400 to-blue-600" :
            percentage >= 40 ? "from-yellow-400 to-yellow-600" :
            "from-red-400 to-red-600"
          )}
          style={{
            transform: `translateX(-${100 - percentage}%)`,
          }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress } 