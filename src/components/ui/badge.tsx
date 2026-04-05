import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-muted border border-border",
        green: "bg-green/15 text-green border border-green/30",
        blue: "bg-blue/15 text-blue border border-blue/30",
        purple: "bg-purple/15 text-purple border border-purple/30",
        red: "bg-red/15 text-red border border-red/30",
        accent: "bg-accent/15 text-accent border border-accent/30",
        orange: "bg-orange/15 text-orange border border-orange/30",
        cyan: "bg-cyan/15 text-cyan border border-cyan/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
