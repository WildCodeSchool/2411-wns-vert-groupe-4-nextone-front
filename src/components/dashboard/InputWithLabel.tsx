import * as React from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Toggle } from "../../components/ui/toggle";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly error?: string;
  readonly children?: React.ReactNode;
}

function InputWithLabelFunc(
  {
    label,
    id,
    name,
    className,
    error,
    type,
    children,
    ...props
  }: InputWithLabelProps,
  ref: React.Ref<HTMLInputElement>
) {
  const inputId = id || name;

  const isPassword = type === "password";
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {children && <div>{children}</div>}
      <Label
        htmlFor={inputId}
        className={cn(
          "text-base font-normal text-gray-800",
          error && "text-red-600"
        )}
      >
        {label} {props.required && "*"}
      </Label>

      <div className="relative">
        <Input
          id={inputId}
          name={name}
          aria-invalid={!!error}
          ref={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            error && "border-red-500 focus-visible:ring-red-500",
            "pr-12",
            className
          )}
          {...props}
        />

        {isPassword && (
          <Toggle
            pressed={showPassword}
            onPressedChange={setShowPassword}
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 bg-transparent"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Toggle>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1 text-start">{error}</p>}
    </div>
  );
}

const InputWithLabel = React.forwardRef(InputWithLabelFunc);
InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
