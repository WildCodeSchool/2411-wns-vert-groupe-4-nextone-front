import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label: string
  readonly error?: string
}

export function InputWithLabel({
  label,
  id,
  name,
  className,
  error,
  ...props
}: InputWithLabelProps) {
  // Fallback id pour le lien htmlFor
  const inputId = id || name

  return (
    <div className={cn("flex flex-col gap-1 w-full max-w-sm", className)}>
      <Label
        htmlFor={inputId}
        className={cn("text-sm font-medium text-gray-800", error && "text-red-600")}
      >
        {label} {props.required && "*"}
      </Label>

      <Input
        id={inputId}
        name={name}
        aria-invalid={!!error}
        {...props}
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
