import type { ReactNode } from "react";
import { Info, AlertTriangle, Lightbulb, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "tip" | "danger" | "pro-tip";

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  { icon: typeof Info; borderColor: string; iconColor: string; bgColor: string; defaultTitle: string }
> = {
  info: {
    icon: Info,
    borderColor: "border-l-blue",
    iconColor: "text-blue",
    bgColor: "bg-blue/5",
    defaultTitle: "Info",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-l-orange",
    iconColor: "text-orange",
    bgColor: "bg-orange/5",
    defaultTitle: "Warning",
  },
  tip: {
    icon: Lightbulb,
    borderColor: "border-l-green",
    iconColor: "text-green",
    bgColor: "bg-green/5",
    defaultTitle: "Tip",
  },
  danger: {
    icon: AlertCircle,
    borderColor: "border-l-red",
    iconColor: "text-red",
    bgColor: "bg-red/5",
    defaultTitle: "Danger",
  },
  "pro-tip": {
    icon: Zap,
    borderColor: "border-l-accent",
    iconColor: "text-accent",
    bgColor: "bg-accent/5",
    defaultTitle: "Pro Tip",
  },
};

export function Callout({ type, title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title ?? config.defaultTitle;

  return (
    <div
      className={cn(
        "my-4 rounded-lg border border-border border-l-4 p-4",
        config.borderColor,
        config.bgColor
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconColor)} />
        <div className="min-w-0">
          <p className={cn("mb-1 font-semibold text-sm", config.iconColor)}>
            {displayTitle}
          </p>
          <div className="text-sm text-text/90 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
