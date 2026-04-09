import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import {
  designSystem,
  type ButtonSize,
  type ButtonVariant,
} from "@/lib/design-system";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  className,
  size = "md",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        designSystem.button.base,
        designSystem.button.sizes[size],
        designSystem.button.variants[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
