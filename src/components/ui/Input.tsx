import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
          error ? 'border-destructive' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  )
)

Input.displayName = 'Input'

export { Input }
