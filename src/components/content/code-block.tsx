"use client";

import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  highlight?: number[];
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language,
  filename,
  highlight = [],
  showLineNumbers = false,
}: CodeBlockProps) {
  const lines = children.trimEnd().split("\n");

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-border bg-surface-2">
      {/* Header bar with filename and/or language */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
          <div className="flex items-center gap-3">
            {/* Colored dots */}
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red/60" />
              <span className="h-3 w-3 rounded-full bg-orange/60" />
              <span className="h-3 w-3 rounded-full bg-green/60" />
            </div>
            {filename && (
              <span className="text-xs font-medium text-muted">{filename}</span>
            )}
          </div>
          {language && (
            <span className="text-xs text-muted uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>
      )}

      {/* Copy button */}
      <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        {(filename || language) ? (
          <div className="absolute right-0 top-8">
            <CopyButton text={children} />
          </div>
        ) : (
          <CopyButton text={children} />
        )}
      </div>

      {/* Code area */}
      <pre className="overflow-x-auto border-0 bg-transparent p-4 m-0 rounded-none">
        <code className="text-sm leading-relaxed">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlight.includes(lineNum);

            return (
              <div
                key={i}
                className={cn(
                  "px-2 -mx-2",
                  isHighlighted && "bg-accent/10 border-l-2 border-accent"
                )}
              >
                {showLineNumbers && (
                  <span className="mr-4 inline-block w-8 text-right text-muted/50 select-none">
                    {lineNum}
                  </span>
                )}
                <span>{line}</span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
