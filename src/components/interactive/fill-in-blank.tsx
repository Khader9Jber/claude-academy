"use client";

import { useState, useCallback } from "react";
import { Check, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlankDefinition {
  id: number;
  answer: string | string[];
  hint?: string;
}

interface FillInBlankProps {
  template: string;
  blanks: BlankDefinition[];
}

export function FillInBlank({ template, blanks }: FillInBlankProps) {
  const [values, setValues] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean> | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleChange = useCallback((id: number, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    // Reset validation when user changes an answer
    setResults(null);
    setShowAnswers(false);
  }, []);

  const checkAnswers = useCallback(() => {
    const newResults: Record<number, boolean> = {};
    blanks.forEach((blank) => {
      const userAnswer = (values[blank.id] || "").trim().toLowerCase();
      const acceptedAnswers = Array.isArray(blank.answer)
        ? blank.answer.map((a) => a.toLowerCase())
        : [blank.answer.toLowerCase()];
      newResults[blank.id] = acceptedAnswers.includes(userAnswer);
    });
    setResults(newResults);
  }, [blanks, values]);

  const handleShowAnswers = useCallback(() => {
    setShowAnswers(true);
    const revealed: Record<number, string> = {};
    blanks.forEach((blank) => {
      const answer = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
      revealed[blank.id] = answer;
    });
    setValues(revealed);
    // Mark all as correct
    const allCorrect: Record<number, boolean> = {};
    blanks.forEach((blank) => {
      allCorrect[blank.id] = true;
    });
    setResults(allCorrect);
  }, [blanks]);

  // Parse template and create segments
  const segments: Array<{ type: "text"; value: string } | { type: "blank"; id: number }> = [];
  const regex = /\{\{(\d+)\}\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: template.slice(lastIndex, match.index) });
    }
    segments.push({ type: "blank", id: parseInt(match[1], 10) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < template.length) {
    segments.push({ type: "text", value: template.slice(lastIndex) });
  }

  const allCorrect = results && Object.values(results).every(Boolean);

  return (
    <div className="my-6 rounded-xl border border-border bg-surface p-6">
      {/* Template with input fields */}
      <div className="mb-6 text-text leading-loose text-sm">
        {segments.map((seg, i) => {
          if (seg.type === "text") {
            return <span key={i}>{seg.value}</span>;
          }

          const blank = blanks.find((b) => b.id === seg.id);
          const isCorrect = results?.[seg.id];
          const isChecked = results !== null;

          return (
            <span key={i} className="relative inline-flex items-center mx-1">
              <input
                type="text"
                value={values[seg.id] || ""}
                onChange={(e) => handleChange(seg.id, e.target.value)}
                placeholder={blank?.hint || "..."}
                disabled={showAnswers}
                className={cn(
                  "inline-block w-32 rounded-md border bg-surface-2 px-2 py-1 text-center font-mono text-sm text-text outline-none transition-colors",
                  !isChecked && "border-border focus:border-accent",
                  isChecked && isCorrect && "border-green bg-green/10",
                  isChecked && !isCorrect && "border-red bg-red/10"
                )}
              />
              {isChecked && (
                <span className="ml-1">
                  {isCorrect ? (
                    <Check className="h-4 w-4 text-green" />
                  ) : (
                    <X className="h-4 w-4 text-red" />
                  )}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Result message */}
      {results && !showAnswers && (
        <div
          className={cn(
            "mb-4 rounded-lg p-3 text-sm",
            allCorrect
              ? "bg-green/10 text-green border border-green/30"
              : "bg-red/10 text-red border border-red/30"
          )}
        >
          {allCorrect
            ? "All correct! Well done."
            : "Some answers are incorrect. Try again or show the answers."}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={checkAnswers}
          disabled={showAnswers}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          Check
        </button>
        <button
          onClick={handleShowAnswers}
          disabled={showAnswers}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-text disabled:opacity-50"
        >
          <Eye className="h-4 w-4" />
          Show Answers
        </button>
      </div>
    </div>
  );
}
