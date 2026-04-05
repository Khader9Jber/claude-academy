import {
  BookOpen,
  Zap,
  Brain,
  Trophy,
  Flame,
  Award,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Zap,
  Brain,
  Trophy,
  Flame,
  Award,
};

export function AchievementBadge({
  title,
  description,
  icon,
  unlocked,
}: AchievementBadgeProps) {
  const IconComponent = iconMap[icon] || Award;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center rounded-xl border p-4 text-center transition-colors",
        unlocked
          ? "border-accent/30 bg-accent/5"
          : "border-border bg-surface-2 opacity-60 grayscale"
      )}
    >
      {/* Icon circle */}
      <div
        className={cn(
          "mb-3 flex h-14 w-14 items-center justify-center rounded-full",
          unlocked ? "bg-accent/15" : "bg-surface"
        )}
      >
        {unlocked ? (
          <IconComponent className="h-7 w-7 text-accent" />
        ) : (
          <div className="relative">
            <IconComponent className="h-7 w-7 text-muted" />
            <Lock className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-muted" />
          </div>
        )}
      </div>

      {/* Title */}
      <h4
        className={cn(
          "mb-1 text-sm font-semibold",
          unlocked ? "text-text" : "text-muted"
        )}
      >
        {title}
      </h4>

      {/* Description */}
      <p className="text-xs text-muted leading-relaxed">{description}</p>
    </div>
  );
}
