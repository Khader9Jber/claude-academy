import { Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LessonHeaderProps {
  title: string;
  difficulty: string;
  duration: number;
  objectives: string[];
}

const difficultyVariant: Record<string, "green" | "blue" | "purple" | "accent"> = {
  beginner: "green",
  intermediate: "blue",
  advanced: "purple",
  expert: "accent",
};

export function LessonHeader({
  title,
  difficulty,
  duration,
  objectives,
}: LessonHeaderProps) {
  const variant = difficultyVariant[difficulty.toLowerCase()] ?? "default";

  return (
    <div className="mb-8">
      {/* Title */}
      <h1 className="mb-4 font-serif text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {title}
      </h1>

      {/* Meta row */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant={variant as "green" | "blue" | "purple" | "accent"}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Clock className="h-4 w-4" />
          {duration} min read
        </span>
      </div>

      {/* Learning objectives */}
      {objectives.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
            What you will learn
          </h3>
          <ul className="space-y-2">
            {objectives.map((objective, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
