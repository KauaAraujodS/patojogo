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
  hint?: string;
  label: string;
};

export function Field({ children, hint, label }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className={designSystem.input.label}>{label}</span>
      {children}
      {hint ? <span className={designSystem.input.hint}>{hint}</span> : null}
    </label>
  );
}
