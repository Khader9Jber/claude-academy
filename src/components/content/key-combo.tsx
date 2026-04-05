import { cn } from "@/lib/utils";

interface KeyComboProps {
  keys: string[];
  className?: string;
}

export function KeyCombo({ keys, className }: KeyComboProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key, i) => (
        <span key={i} className="contents">
          <kbd className="inline-flex items-center justify-center rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-xs font-medium text-text shadow-sm min-w-[1.5rem]">
            {key}
          </kbd>
          {i < keys.length - 1 && (
            <span className="text-muted text-xs mx-0.5">+</span>
          )}
        </span>
      ))}
    </span>
  );
}
