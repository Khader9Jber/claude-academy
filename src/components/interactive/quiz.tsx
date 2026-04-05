"use client";

import { useState, useCallback } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/lib/store";
import type { QuizQuestion } from "@/types";

interface QuizProps {
  questions: QuizQuestion[];
  quizId: string;
}

export function Quiz({ questions, quizId }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const saveQuizScore = useProgressStore((s) => s.saveQuizScore);

  const currentQuestion = questions[currentIndex];

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setSelectedAnswer(optionIndex);
      setAnswered(true);

      if (optionIndex === currentQuestion.correct) {
        setScore((prev) => prev + 1);
      }
    },
    [answered, currentQuestion.correct]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      const finalScore = Math.round(
        ((score + (selectedAnswer === currentQuestion.correct ? 0 : 0)) /
          questions.length) *
          100
      );
      // Score is already accumulated; compute final
      const computedScore = Math.round((score / questions.length) * 100);
      saveQuizScore(quizId, computedScore);
      setFinished(true);
    }
  }, [
    currentIndex,
    questions.length,
    score,
    selectedAnswer,
    currentQuestion.correct,
    saveQuizScore,
    quizId,
  ]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }, []);

  // Score summary screen
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="my-6 rounded-xl border border-border bg-surface p-8 text-center">
        <div className="mb-4">
          <div
            className={cn(
              "mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold",
              percentage >= 70
                ? "bg-green/15 text-green"
                : "bg-red/15 text-red"
            )}
          >
            {percentage}%
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-text">Quiz Complete</h3>
        <p className="mb-1 text-muted">
          You got {score} out of {questions.length} questions correct.
        </p>
        <p className="mb-6 text-sm text-muted">
          {percentage >= 90
            ? "Excellent work!"
            : percentage >= 70
            ? "Good job! Keep learning."
            : "Review the material and try again."}
        </p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-medium text-background transition-colors hover:bg-accent/90"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl border border-border bg-surface p-6">
      {/* Progress indicator */}
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span>Score: {score}</span>
      </div>
      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{
            width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <h3 className="mb-6 text-lg font-semibold text-text">
        {currentQuestion.question}
      </h3>

      {/* Options */}
      <div className="mb-6 space-y-3">
        {currentQuestion.options.map((option, i) => {
          const isCorrect = i === currentQuestion.correct;
          const isSelected = i === selectedAnswer;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition-colors",
                !answered &&
                  "border-border hover:border-accent/50 hover:bg-surface-2 cursor-pointer",
                answered && isCorrect && "border-green bg-green/10",
                answered && isSelected && !isCorrect && "border-red bg-red/10",
                answered &&
                  !isCorrect &&
                  !isSelected &&
                  "border-border opacity-50",
                "disabled:cursor-default"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  !answered && "border-border text-muted",
                  answered && isCorrect && "border-green bg-green text-white",
                  answered &&
                    isSelected &&
                    !isCorrect &&
                    "border-red bg-red text-white"
                )}
              >
                {answered && isCorrect ? (
                  <CheckCircle className="h-4 w-4" />
                ) : answered && isSelected && !isCorrect ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="text-text">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="mb-4 rounded-lg border border-border bg-surface-2 p-4">
          <p className="text-sm text-muted leading-relaxed">
            <span className="font-semibold text-text">Explanation: </span>
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="rounded-lg bg-accent px-6 py-2.5 font-medium text-background transition-colors hover:bg-accent/90"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}
