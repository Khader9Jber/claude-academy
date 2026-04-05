import { cn } from "@/lib/utils";

interface Step {
  title: string;
  content: string;
}

interface StepListProps {
  steps: Step[];
}

export function StepList({ steps }: StepListProps) {
  return (
    <div className="my-6 space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="relative flex gap-4">
          {/* Vertical connecting line */}
          {i < steps.length - 1 && (
            <div
              className="absolute left-5 top-10 bottom-0 w-px bg-border"
              aria-hidden
            />
          )}

          {/* Step number circle */}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface text-accent font-bold text-sm">
            {i + 1}
          </div>

          {/* Step content */}
          <div className={cn("pb-8", i === steps.length - 1 && "pb-0")}>
            <h4 className="mb-1 font-semibold text-text">{step.title}</h4>
            <p className="text-sm text-muted leading-relaxed">{step.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
