import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Left: branding */}
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-serif text-lg italic text-accent">
              {SITE_NAME}
            </span>
            <p className="text-xs text-muted">
              Built with <span className="text-green">&#9829;</span> by KK
            </p>
          </div>

          {/* Center: links */}
          <div className="flex items-center gap-6 text-sm text-muted">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://docs.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Anthropic Docs
            </a>
            <Link
              href="/curriculum"
              className="hover:text-foreground transition-colors"
            >
              Curriculum
            </Link>
          </div>

          {/* Right: copyright */}
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
