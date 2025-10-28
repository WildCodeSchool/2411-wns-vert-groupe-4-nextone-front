import * as React from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { cn } from "../../lib/utils";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly error?: string;
}

function InputWithLabelFunc(
  { label, id, name, className, error, ...props }: InputWithLabelProps,
  ref: React.Ref<HTMLInputElement>
) {
  const inputId = id || name;

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <Label
        htmlFor={inputId}
        className={cn(
          "text-base font-normal text-gray-800",
          error && "text-red-600"
        )}
      >
        {label} {props.required && "*"}
      </Label>
      <Input
        id={inputId}
        name={name}
        aria-invalid={!!error}
        ref={ref}
        {...props}
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1 text-start">{error}</p>}
    </div>
  );
}

const InputWithLabel = React.forwardRef(InputWithLabelFunc);
InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
