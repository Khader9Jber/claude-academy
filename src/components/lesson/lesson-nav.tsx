import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonLink {
  title: string;
  href: string;
}

interface LessonNavProps {
  prev?: LessonLink;
  next?: LessonLink;
}

export function LessonNav({ prev, next }: LessonNavProps) {
  return (
    <nav className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
      {/* Previous lesson */}
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/50"
        >
          <ArrowLeft className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
          <div className="min-w-0">
            <span className="block text-xs text-muted">Previous</span>
            <span className="block truncate text-sm font-medium text-text group-hover:text-accent">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {/* Next lesson */}
      {next ? (
        <Link
          href={next.href}
          className="group flex items-center justify-end gap-3 rounded-lg border border-border bg-surface p-4 text-right transition-colors hover:border-accent/50"
        >
          <div className="min-w-0">
            <span className="block text-xs text-muted">Next</span>
            <span className="block truncate text-sm font-medium text-text group-hover:text-accent">
              {next.title}
            </span>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
