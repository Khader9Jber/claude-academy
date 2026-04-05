"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TerminalStep } from "@/types";

interface TerminalSimulatorProps {
  steps: TerminalStep[];
  title?: string;
}

interface HistoryEntry {
  type: "prompt" | "input" | "output" | "error" | "hint";
  text: string;
}

export function TerminalSimulator({
  steps,
  title = "Interactive Terminal",
}: TerminalSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  // Show initial prompt
  useEffect(() => {
    if (!completed && step) {
      setHistory((prev) => {
        // Don't duplicate the current prompt
        const lastPrompt = prev.findLast((e) => e.type === "prompt");
        if (lastPrompt?.text === step.prompt) return prev;
        return [...prev, { type: "prompt", text: step.prompt }];
      });
    }
  }, [currentStep, completed, step]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (completed || !step) return;

      const userInput = inputValue.trim();
      if (!userInput) return;

      const expectedInputs = Array.isArray(step.expectedInput)
        ? step.expectedInput
        : [step.expectedInput];

      const isCorrect = expectedInputs.some(
        (exp) => userInput.toLowerCase() === exp.toLowerCase()
      );

      const newHistory: HistoryEntry[] = [
        ...history,
        { type: "input", text: userInput },
      ];

      if (isCorrect) {
        newHistory.push({ type: "output", text: step.output });

        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
          setAttempts(0);
          // Next step's prompt will be added by the effect
        } else {
          setCompleted(true);
          newHistory.push({
            type: "output",
            text: "All steps completed! Great work.",
          });
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        newHistory.push({
          type: "error",
          text: `Command not recognized. Try again.`,
        });

        if (newAttempts >= 2) {
          newHistory.push({ type: "hint", text: `Hint: ${step.hint}` });
        }
      }

      setHistory(newHistory);
      setInputValue("");
    },
    [inputValue, step, history, currentStep, steps.length, attempts, completed]
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-surface-2">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2">
        <Terminal className="h-4 w-4 text-muted" />
        <span className="text-xs font-medium text-muted">{title}</span>
        <div className="ml-auto flex items-center gap-1 text-xs text-muted">
          Step {Math.min(currentStep + 1, steps.length)} / {steps.length}
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        onClick={focusInput}
        className="h-64 cursor-text overflow-y-auto p-4 font-mono text-sm"
      >
        {history.map((entry, i) => (
          <div key={i} className="mb-1">
            {entry.type === "prompt" && (
              <div className="text-muted italic"># {entry.text}</div>
            )}
            {entry.type === "input" && (
              <div>
                <span className="text-green font-bold">$ </span>
                <span className="text-text">{entry.text}</span>
              </div>
            )}
            {entry.type === "output" && (
              <div className="text-text whitespace-pre-wrap">{entry.text}</div>
            )}
            {entry.type === "error" && (
              <div className="text-red">{entry.text}</div>
            )}
            {entry.type === "hint" && (
              <div className="text-accent">{entry.text}</div>
            )}
          </div>
        ))}

        {/* Active input line */}
        {!completed && (
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-green font-bold mr-1">$ </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent text-text outline-none caret-accent"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        )}
      </div>
    </div>
  );
}
