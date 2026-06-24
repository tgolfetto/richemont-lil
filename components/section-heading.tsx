import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.32em] text-gold-700">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl font-light tracking-wide text-[color:var(--color-text)] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-text)]">{description}</p>
      ) : null}
    </div>
  );
}
