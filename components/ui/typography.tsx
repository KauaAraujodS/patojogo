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

export function DisplayTitle({
  as: Component = "h1",
  children,
  className,
  ...props
}: TextProps<"h1">) {
  return (
    <Component
      className={cn(designSystem.typography.display, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function PageTitle({
  as: Component = "h2",
  children,
  className,
  ...props
}: TextProps<"h2">) {
  return (
    <Component
      className={cn(designSystem.typography.pageTitle, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function SectionTitle({
  as: Component = "p",
  children,
  className,
  ...props
}: TextProps<"p">) {
  return (
    <Component
      className={cn(designSystem.typography.sectionTitle, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Lead({
  as: Component = "p",
  children,
  className,
  ...props
}: TextProps<"p">) {
  return (
    <Component
      className={cn(designSystem.typography.lead, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function BodyText({
  as: Component = "p",
  children,
  className,
  ...props
}: TextProps<"p">) {
  return (
    <Component
      className={cn(designSystem.typography.body, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Caption({
  as: Component = "p",
  children,
  className,
  ...props
}: TextProps<"p">) {
  return (
    <Component
      className={cn(designSystem.typography.caption, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
