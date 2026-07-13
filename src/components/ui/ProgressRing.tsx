import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ProgressRingProps {
  percentage: number
  radius?: number
  strokeWidth?: number
  children?: ReactNode
  className?: string
}

export function ProgressRing({
  percentage,
  radius = 50,
  strokeWidth = 4,
  children,
  className = '',
}: ProgressRingProps) {
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width={radius * 2 + strokeWidth * 2} height={radius * 2 + strokeWidth * 2}>
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-25"
        />
        <motion.circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary origin-center -rotate-90"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </svg>
      {children && <div className="absolute">{children}</div>}
    </div>
  )
}
