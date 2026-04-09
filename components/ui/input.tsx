import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { designSystem } from "@/lib/design-system";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(designSystem.input.base, className)}
      {...props}
    />
  );
}

type FieldProps = {
  children: React.ReactNode;
  className?: string;
  hintClassName?: string;
  hint?: string;
  label: string;
  labelClassName?: string;
};

export function Field({
  children,
  className,
  hint,
  hintClassName,
  label,
  labelClassName,
}: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className={cn(designSystem.input.label, labelClassName)}>{label}</span>
      {children}
      {hint ? (
        <span className={cn(designSystem.input.hint, hintClassName)}>{hint}</span>
      ) : null}
    </label>
  );
}
