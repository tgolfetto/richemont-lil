import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-[1.5rem] border border-zinc-200 bg-white px-4 py-3 text-sm text-[color:var(--color-text)] outline-none transition placeholder:text-zinc-400 focus:border-gold-500 focus:ring-4 focus:ring-gold-100",
        className
      )}
      {...props}
    />
  );
}
