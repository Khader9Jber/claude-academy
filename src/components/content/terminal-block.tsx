"use client";

import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { CopyButton } from "./copy-button";

interface TerminalBlockProps {
  command?: string;
  output?: string;
  title?: string;
}

export function TerminalBlock({
  command,
  output,
  title = "Terminal",
}: TerminalBlockProps) {
  const copyText = [command ? `$ ${command}` : "", output].filter(Boolean).join("\n");

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-border bg-surface-2">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted" />
          <span className="text-xs font-medium text-muted">{title}</span>
        </div>
        <CopyButton
          text={copyText}
          className="opacity-0 group-hover:opacity-100"
        />
      </div>

      {/* Terminal content */}
      <pre className="overflow-x-auto border-0 bg-transparent p-4 m-0 rounded-none">
        <code className="text-sm leading-relaxed">
          {command && (
            <div>
              <span className="text-green font-bold select-none">$ </span>
              <span className="text-text">{command}</span>
            </div>
          )}
          {output && (
            <div className={cn("text-muted", command && "mt-1")}>
              {output}
            </div>
          )}
        </code>
      </pre>
    </div>
  );
}
