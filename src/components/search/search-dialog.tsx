"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, BookOpen, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  title: string;
  module: string;
  type: "lesson" | "quiz" | "exercise";
  href: string;
}

// Hardcoded lesson data for initial implementation (Fuse.js integration later)
const LESSON_DATA: SearchResult[] = [
  { title: "What is Claude?", module: "Getting Started", type: "lesson", href: "/lessons/what-is-claude" },
  { title: "Your First Conversation", module: "Getting Started", type: "lesson", href: "/lessons/first-conversation" },
  { title: "Understanding Context Windows", module: "Getting Started", type: "lesson", href: "/lessons/context-windows" },
  { title: "Setting Up Your Workflow", module: "Getting Started", type: "lesson", href: "/lessons/setup-workflow" },
  { title: "Getting Started Quiz", module: "Getting Started", type: "quiz", href: "/lessons/getting-started-quiz" },
  { title: "Anatomy of a Good Prompt", module: "Prompt Engineering", type: "lesson", href: "/lessons/anatomy-of-prompt" },
  { title: "Role Prompting", module: "Prompt Engineering", type: "lesson", href: "/lessons/role-prompting" },
  { title: "Few-Shot Prompting", module: "Prompt Engineering", type: "lesson", href: "/lessons/few-shot" },
  { title: "Chain of Thought", module: "Prompt Engineering", type: "lesson", href: "/lessons/chain-of-thought" },
  { title: "Prompt Templates", module: "Prompt Engineering", type: "lesson", href: "/lessons/prompt-templates" },
  { title: "Common Mistakes", module: "Prompt Engineering", type: "lesson", href: "/lessons/common-mistakes" },
  { title: "Prompt Engineering Exercise", module: "Prompt Engineering", type: "exercise", href: "/lessons/prompt-exercise" },
  { title: "Prompt Engineering Quiz", module: "Prompt Engineering", type: "quiz", href: "/lessons/prompt-quiz" },
  { title: "System Prompts", module: "Advanced Techniques", type: "lesson", href: "/lessons/system-prompts" },
  { title: "Tool Use & Function Calling", module: "Advanced Techniques", type: "lesson", href: "/lessons/tool-use" },
  { title: "Structured Output", module: "Advanced Techniques", type: "lesson", href: "/lessons/structured-output" },
  { title: "Multi-Turn Conversations", module: "Advanced Techniques", type: "lesson", href: "/lessons/multi-turn" },
  { title: "Agentic Workflows", module: "Advanced Techniques", type: "lesson", href: "/lessons/agentic-workflows" },
  { title: "Advanced Quiz", module: "Advanced Techniques", type: "quiz", href: "/lessons/advanced-quiz" },
  { title: "Build a Study Assistant", module: "Real-World Projects", type: "exercise", href: "/lessons/study-assistant" },
  { title: "Code Review Bot", module: "Real-World Projects", type: "exercise", href: "/lessons/code-review-bot" },
  { title: "Content Generator", module: "Real-World Projects", type: "exercise", href: "/lessons/content-generator" },
  { title: "Data Analysis Pipeline", module: "Real-World Projects", type: "exercise", href: "/lessons/data-analysis" },
];

const typeIcons: Record<string, typeof FileText> = {
  lesson: FileText,
  quiz: HelpCircle,
  exercise: BookOpen,
};

const typeBadgeColors: Record<string, string> = {
  lesson: "bg-blue/15 text-blue",
  quiz: "bg-purple/15 text-purple",
  exercise: "bg-green/15 text-green",
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return LESSON_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.module.toLowerCase().includes(lower)
    ).slice(0, 8);
  }, [query]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      router.push(result.href);
      setOpen(false);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    },
    [results, selectedIndex, handleSelect]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        {/* Search input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search lessons, quizzes, exercises..."
            className="flex-1 bg-transparent px-3 py-4 text-sm text-text placeholder:text-muted outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted">
              No results found for &quot;{query}&quot;
            </div>
          )}
          {results.map((result, i) => {
            const Icon = typeIcons[result.type] || FileText;
            return (
              <button
                key={result.href}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  i === selectedIndex
                    ? "bg-surface-2 text-text"
                    : "text-muted hover:bg-surface-2"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-text">
                    {result.title}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {result.module}
                  </span>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    typeBadgeColors[result.type]
                  )}
                >
                  {result.type}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted">
          <span>Navigate with arrow keys</span>
          <span>
            Press <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
