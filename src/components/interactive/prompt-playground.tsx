"use client";

import { useState, useMemo, useCallback } from "react";
import { Copy, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptPlaygroundProps {
  initialValues?: Record<string, string>;
  showComparison?: boolean;
  beforePrompt?: string;
}

const SECTIONS = [
  {
    key: "role",
    label: "Role",
    help: "Who should the AI act as? (e.g., 'You are an expert Python developer')",
    placeholder: "You are a...",
  },
  {
    key: "context",
    label: "Context",
    help: "What background information does the AI need?",
    placeholder: "Background: ...",
  },
  {
    key: "task",
    label: "Task",
    help: "What specific task should the AI perform?",
    placeholder: "Your task is to...",
  },
  {
    key: "constraints",
    label: "Constraints",
    help: "What rules or limitations should the AI follow?",
    placeholder: "Rules:\n- ...\n- ...",
  },
  {
    key: "format",
    label: "Format",
    help: "How should the output be structured?",
    placeholder: "Respond in the following format:\n...",
  },
  {
    key: "examples",
    label: "Examples",
    help: "Provide example input/output pairs to guide the AI.",
    placeholder: "Example:\nInput: ...\nOutput: ...",
  },
] as const;

export function PromptPlayground({
  initialValues = {},
  showComparison = false,
  beforePrompt,
}: PromptPlaygroundProps) {
  const [values, setValues] = useState<Record<string, string>>(
    SECTIONS.reduce(
      (acc, s) => ({ ...acc, [s.key]: initialValues[s.key] || "" }),
      {} as Record<string, string>
    )
  );
  const [copied, setCopied] = useState(false);

  const handleChange = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const assembledPrompt = useMemo(() => {
    const parts: string[] = [];
    SECTIONS.forEach((section) => {
      const value = values[section.key]?.trim();
      if (value) {
        parts.push(`## ${section.label}\n${value}`);
      }
    });
    return parts.join("\n\n");
  }, [values]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(assembledPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = assembledPrompt;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [assembledPrompt]);

  return (
    <div className="my-6 rounded-xl border border-border bg-surface overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Input sections */}
        <div className="p-6 space-y-5 max-h-[600px] overflow-y-auto">
          <h3 className="font-semibold text-text text-lg">Build Your Prompt</h3>
          {SECTIONS.map((section) => (
            <div key={section.key}>
              <label className="mb-1 block text-sm font-medium text-text">
                {section.label}
              </label>
              <p className="mb-2 text-xs text-muted">{section.help}</p>
              <textarea
                value={values[section.key]}
                onChange={(e) => handleChange(section.key, e.target.value)}
                placeholder={section.placeholder}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-sm text-text placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
              />
            </div>
          ))}
        </div>

        {/* Preview pane */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-3">
            <h3 className="font-semibold text-text text-sm">
              {showComparison && beforePrompt ? "Comparison" : "Live Preview"}
            </h3>
            <button
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                copied
                  ? "bg-green/15 text-green"
                  : "bg-surface-2 text-muted hover:text-text"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="flex-1 max-h-[560px] overflow-y-auto p-6">
            {showComparison && beforePrompt && (
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-red/15 px-2 py-0.5 text-xs font-medium text-red">
                    Before
                  </span>
                </div>
                <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface-2 p-4 font-mono text-sm text-muted leading-relaxed">
                  {beforePrompt}
                </pre>
                <div className="my-4 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-accent" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-green/15 px-2 py-0.5 text-xs font-medium text-green">
                    After
                  </span>
                </div>
              </div>
            )}

            {assembledPrompt ? (
              <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface-2 p-4 font-mono text-sm text-text leading-relaxed">
                {assembledPrompt}
              </pre>
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-muted">
                Start typing to see your prompt preview...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
