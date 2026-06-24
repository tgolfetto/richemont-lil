import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-none border border-primary bg-transparent px-4 text-sm text-[color:var(--color-text)] outline-none transition placeholder:text-zinc-400 focus:bg-white focus:border-primary focus:ring-0",
        className
      )}
      {...props}
    />
  );
}
