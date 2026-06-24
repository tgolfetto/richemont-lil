import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export function Button({
  className,
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-none border border-primary bg-transparent px-4 py-2 font-button font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-50",
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
