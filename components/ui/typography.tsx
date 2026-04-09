import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { designSystem } from "@/lib/design-system";

type TextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Eyebrow({
  children,
  className,
  ...props
}: TextProps<"span">) {
  return (
    <span className={cn(designSystem.typography.eyebrow, className)} {...props}>
      {children}
    </span>
  );
}

export function DisplayTitle<T extends ElementType = "h1">({
  as,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "h1";

  return (
    <Component
      className={cn(designSystem.typography.display, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function PageTitle<T extends ElementType = "h2">({
  as,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "h2";

  return (
    <Component
      className={cn(designSystem.typography.pageTitle, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function SectionTitle<T extends ElementType = "p">({
  as,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(designSystem.typography.sectionTitle, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Lead<T extends ElementType = "p">({
  as,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(designSystem.typography.lead, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function BodyText<T extends ElementType = "p">({
  as,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(designSystem.typography.body, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Caption<T extends ElementType = "p">({
  as,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(designSystem.typography.caption, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
