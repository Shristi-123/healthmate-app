import React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
          error ? 'border-destructive' : ''
        } ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  )
)

Select.displayName = 'Select'

export { Select }
