import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  required?: boolean
  description?: string
  htmlFor?: string
}

function FormField({ 
  label, 
  required, 
  description,
  htmlFor,
  className, 
  children, 
  ...props 
}: FormFieldProps) {
  const generatedId = React.useId()
  const fieldId = htmlFor || generatedId

  // Clone children to inject the id prop
  const childrenWithId = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Only add id if the child doesn't already have one
      const childProps = child.props as Record<string, unknown>
      if (!childProps.id) {
        return React.cloneElement(child, { id: fieldId } as React.HTMLAttributes<HTMLElement>)
      }
    }
    return child
  })

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {childrenWithId}
      {description && (
        <p className="text-xs text-text-secondary">{description}</p>
      )}
    </div>
  )
}

export { FormField }
