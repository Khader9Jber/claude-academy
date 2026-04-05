"use client";

import { X, Clock, BarChart3, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatDuration, cn } from "@/lib/utils";

interface PreviewQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ContentPreviewProps {
  title: string;
  difficulty: string;
  duration: number;
  content: string;
  quizQuestions: PreviewQuizQuestion[];
  onClose: () => void;
}

const DIFFICULTY_BADGE: Record<
  string,
  "green" | "blue" | "purple" | "orange"
> = {
  beginner: "green",
  intermediate: "blue",
  advanced: "purple",
  expert: "orange",
};

/**
 * Renders a basic subset of Markdown into React elements.
 * Handles headings, bold, italic, inline code, code blocks,
 * unordered/ordered lists, blockquotes, horizontal rules, and paragraphs.
 */
function renderMarkdown(raw: string): React.ReactNode[] {
  if (!raw.trim()) {
    return [
      <p key="empty" className="italic text-muted">
        No content yet.
      </p>,
    ];
  }

  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  function inlineFormat(text: string): React.ReactNode {
    // Process inline code, bold, italic
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Inline code
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        parts.push(
          <code
            key={key++}
            className="rounded bg-surface-2 border border-border px-1.5 py-0.5 text-xs font-mono"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Bold
      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        parts.push(
          <strong key={key++} className="font-semibold">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic
      const italicMatch = remaining.match(/^\*(.+?)\*/);
      if (italicMatch) {
        parts.push(<em key={key++}>{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Plain character
      const nextSpecial = remaining.search(/[`*]/);
      if (nextSpecial === -1) {
        parts.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        // Special char not part of a pattern, consume it
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        parts.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre
          key={elements.length}
          className="rounded-lg border border-border bg-surface p-4 overflow-x-auto text-sm font-mono leading-relaxed"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const sizes: Record<number, string> = {
        1: "text-2xl font-bold mt-0 mb-4",
        2: "text-xl font-semibold mt-8 mb-3 pb-2 border-b border-border",
        3: "text-lg font-semibold mt-6 mb-2",
        4: "text-base font-semibold mt-4 mb-1",
      };
      const cls = cn("text-foreground", sizes[level]);
      const k = elements.length;
      const formatted = inlineFormat(text);
      if (level === 1) {
        elements.push(<h1 key={k} className={cls}>{formatted}</h1>);
      } else if (level === 2) {
        elements.push(<h2 key={k} className={cls}>{formatted}</h2>);
      } else if (level === 3) {
        elements.push(<h3 key={k} className={cls}>{formatted}</h3>);
      } else {
        elements.push(<h4 key={k} className={cls}>{formatted}</h4>);
      }
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(
        <hr
          key={elements.length}
          className="my-6 border-t border-border"
        />
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={elements.length}
          className="border-l-3 border-accent pl-4 my-4 text-muted italic"
        >
          {quoteLines.map((ql, qi) => (
            <p key={qi} className="mb-1 last:mb-0">
              {inlineFormat(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={elements.length} className="list-disc pl-6 my-3 space-y-1">
          {items.map((item, ii) => (
            <li key={ii} className="text-foreground leading-relaxed">
              {inlineFormat(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol
          key={elements.length}
          className="list-decimal pl-6 my-3 space-y-1"
        >
          {items.map((item, ii) => (
            <li key={ii} className="text-foreground leading-relaxed">
              {inlineFormat(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph (default)
    elements.push(
      <p
        key={elements.length}
        className="text-foreground leading-relaxed mb-4"
      >
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return elements;
}

export function ContentPreview({
  title,
  difficulty,
  duration,
  content,
  quizQuestions,
  onClose,
}: ContentPreviewProps) {
  return (
    <div
      data-testid="content-preview"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4 sm:p-8"
    >
      <div className="relative w-full max-w-3xl rounded-xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4 rounded-t-xl">
          <h2 className="text-lg font-semibold text-foreground">
            Content Preview
          </h2>
          <button
            data-testid="preview-close-button"
            onClick={onClose}
            className="rounded-md p-2 text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and meta */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {title || "Untitled Lesson"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant={DIFFICULTY_BADGE[difficulty] ?? "default"}>
                {difficulty}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Rendered markdown content */}
          <div className="prose max-w-none">{renderMarkdown(content)}</div>

          {/* Quiz preview */}
          {quizQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-t border-border pt-6">
                <BarChart3 className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">
                  Quiz ({quizQuestions.length}{" "}
                  {quizQuestions.length === 1 ? "question" : "questions"})
                </h2>
              </div>

              {quizQuestions.map((q, qi) => (
                <div
                  key={qi}
                  data-testid={`preview-quiz-${qi}`}
                  className="rounded-xl border border-border bg-surface-2 p-4 space-y-3"
                >
                  <p className="font-medium text-foreground">
                    <span className="text-muted mr-2">Q{qi + 1}.</span>
                    {q.question || "No question text"}
                  </p>
                  <div className="space-y-1.5 pl-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                          oi === q.correct
                            ? "bg-green/10 border border-green/30 text-green"
                            : "text-muted"
                        )}
                      >
                        {oi === q.correct && (
                          <CheckCircle className="h-4 w-4 shrink-0" />
                        )}
                        <span
                          className={cn(
                            "mr-2 font-mono text-xs",
                            oi === q.correct
                              ? "text-green"
                              : "text-muted"
                          )}
                        >
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {opt || "Empty option"}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="rounded-lg bg-accent/5 border border-accent/20 px-3 py-2 text-sm text-muted">
                      <span className="font-medium text-accent">
                        Explanation:{" "}
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
