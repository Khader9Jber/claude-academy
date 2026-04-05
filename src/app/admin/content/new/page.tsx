"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/admin-guard";
import { ContentPreview } from "@/components/admin/content-preview";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { slugify, cn } from "@/lib/utils";

interface QuizOption {
  text: string;
}

interface QuizQuestionForm {
  question: string;
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
  correctIndex: number;
  explanation: string;
}

const MODULES = [
  { slug: "claude-fundamentals", label: "Claude Fundamentals" },
  { slug: "prompt-engineering", label: "Prompt Engineering" },
  { slug: "claude-code-basics", label: "Claude Code Basics" },
  { slug: "commands-and-navigation", label: "Commands & Navigation" },
  { slug: "claude-md-and-config", label: "CLAUDE.md & Configuration" },
  { slug: "session-and-context", label: "Session & Context" },
  { slug: "git-and-workflows", label: "Git & Workflows" },
  { slug: "mcp-fundamentals", label: "MCP Fundamentals" },
  { slug: "hooks-and-automation", label: "Hooks & Automation" },
  { slug: "agents-and-skills", label: "Agents & Skills" },
  { slug: "advanced-workflows", label: "Advanced Workflows" },
  { slug: "enterprise-and-production", label: "Enterprise & Production" },
  { slug: "capstone", label: "Capstone Project" },
] as const;

const DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

function emptyQuestion(): QuizQuestionForm {
  return {
    question: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctIndex: 0,
    explanation: "",
  };
}

export default function CreateLessonPage() {
  const router = useRouter();
  const { user } = useAdmin();

  const [moduleSlug, setModuleSlug] = useState<string>(MODULES[0].slug);
  const [title, setTitle] = useState("");
  const [lessonSlug, setLessonSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [order, setOrder] = useState(1);
  const [difficulty, setDifficulty] = useState<
    (typeof DIFFICULTIES)[number]
  >("beginner");
  const [duration, setDuration] = useState(15);
  const [tags, setTags] = useState("");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [content, setContent] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionForm[]>([]);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      if (!slugManual) {
        setLessonSlug(slugify(value));
      }
    },
    [slugManual]
  );

  function addObjective() {
    setObjectives((prev) => [...prev, ""]);
  }

  function removeObjective(index: number) {
    setObjectives((prev) => prev.filter((_, i) => i !== index));
  }

  function updateObjective(index: number, value: string) {
    setObjectives((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  function addQuestion() {
    setQuizQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuizQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQuestion(
    index: number,
    field: keyof QuizQuestionForm,
    value: string | number
  ) {
    setQuizQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;
        return { ...q, [field]: value };
      })
    );
  }

  function updateQuestionOption(
    qIndex: number,
    oIndex: number,
    value: string
  ) {
    setQuizQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = [...q.options] as QuizQuestionForm["options"];
        options[oIndex] = { text: value };
        return { ...q, options };
      })
    );
  }

  async function handleSave() {
    if (!supabaseReady) return;
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!lessonSlug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();

    const quizData = quizQuestions.map((q, idx) => ({
      id: `q-${idx + 1}`,
      question: q.question,
      type: "multiple-choice" as const,
      options: q.options.map((o) => o.text),
      correct: q.correctIndex,
      explanation: q.explanation,
    }));

    const payload = {
      module_slug: moduleSlug,
      lesson_slug: lessonSlug,
      title: title.trim(),
      difficulty,
      duration,
      order,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      objectives: objectives.filter((o) => o.trim() !== ""),
      content,
      quiz_data: quizData,
      published,
      created_by: user?.id ?? null,
    };

    const { error: dbError } = await supabase
      .from("managed_content")
      .insert(payload);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/content");
  }

  if (!supabaseReady) {
    return (
      <AdminGuard>
        <div
          data-testid="supabase-not-configured"
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-16 px-6 text-center"
        >
          <h3 className="text-lg font-semibold text-foreground">
            Supabase Not Configured
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Admin content creation requires Supabase. Set
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
            environment variables to get started.
          </p>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div data-testid="create-lesson-page" className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/content"
            data-testid="back-to-content"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-2 border border-transparent hover:border-border transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Create New Lesson
          </h1>
        </div>

        {error && (
          <div
            data-testid="form-error"
            className="rounded-lg border border-red/30 bg-red/10 px-4 py-3 text-sm text-red"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main form area */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title */}
            <FormField label="Lesson Title" htmlFor="title">
              <input
                id="title"
                data-testid="field-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Introduction to Prompt Patterns"
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
              />
            </FormField>

            {/* Slug */}
            <FormField label="Slug" htmlFor="slug">
              <input
                id="slug"
                data-testid="field-slug"
                type="text"
                value={lessonSlug}
                onChange={(e) => {
                  setSlugManual(true);
                  setLessonSlug(e.target.value);
                }}
                placeholder="auto-generated-from-title"
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
              />
            </FormField>

            {/* Content body */}
            <FormField label="Content Body (Markdown)" htmlFor="content">
              <textarea
                id="content"
                data-testid="field-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                placeholder="Write your lesson content in Markdown..."
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none resize-y"
              />
            </FormField>

            {/* Learning Objectives */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Learning Objectives
              </label>
              <div className="space-y-2">
                {objectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      data-testid={`field-objective-${i}`}
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(i, e.target.value)}
                      placeholder={`Objective ${i + 1}`}
                      className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                    />
                    {objectives.length > 1 && (
                      <button
                        data-testid={`remove-objective-${i}`}
                        onClick={() => removeObjective(i)}
                        className="rounded-md p-2 text-red hover:bg-red/10 transition-colors"
                        aria-label="Remove objective"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                data-testid="add-objective-button"
                onClick={addObjective}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Objective
              </button>
            </div>

            {/* Quiz Questions */}
            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">
                Quiz Questions
              </label>
              {quizQuestions.length === 0 ? (
                <p className="text-sm text-muted">
                  No quiz questions yet. Add one below.
                </p>
              ) : (
                <div className="space-y-4">
                  {quizQuestions.map((q, qi) => (
                    <div
                      key={qi}
                      data-testid={`quiz-question-${qi}`}
                      className="rounded-xl border border-border bg-surface p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-medium text-muted">
                          Question {qi + 1}
                        </span>
                        <button
                          data-testid={`remove-question-${qi}`}
                          onClick={() => removeQuestion(qi)}
                          className="rounded-md p-1 text-red hover:bg-red/10 transition-colors"
                          aria-label="Remove question"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <input
                        data-testid={`question-text-${qi}`}
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(qi, "question", e.target.value)
                        }
                        placeholder="Enter the question..."
                        className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                      />

                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qi}`}
                              data-testid={`correct-option-${qi}-${oi}`}
                              checked={q.correctIndex === oi}
                              onChange={() =>
                                updateQuestion(qi, "correctIndex", oi)
                              }
                              className="h-4 w-4 accent-accent"
                            />
                            <input
                              data-testid={`option-text-${qi}-${oi}`}
                              type="text"
                              value={opt.text}
                              onChange={(e) =>
                                updateQuestionOption(qi, oi, e.target.value)
                              }
                              placeholder={`Option ${oi + 1}`}
                              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      <input
                        data-testid={`question-explanation-${qi}`}
                        type="text"
                        value={q.explanation}
                        onChange={(e) =>
                          updateQuestion(qi, "explanation", e.target.value)
                        }
                        placeholder="Explanation (shown after answering)"
                        className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
              <button
                data-testid="add-question-button"
                onClick={addQuestion}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:border-border-accent transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            </div>
          </div>

          {/* Sidebar meta */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
              <h2 className="text-sm font-semibold text-foreground">
                Lesson Settings
              </h2>

              {/* Module */}
              <FormField label="Module" htmlFor="module">
                <select
                  id="module"
                  data-testid="field-module"
                  value={moduleSlug}
                  onChange={(e) => setModuleSlug(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  {MODULES.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Difficulty */}
              <FormField label="Difficulty" htmlFor="difficulty">
                <select
                  id="difficulty"
                  data-testid="field-difficulty"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value as (typeof DIFFICULTIES)[number]
                    )
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Order */}
              <FormField label="Order" htmlFor="order">
                <input
                  id="order"
                  data-testid="field-order"
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) =>
                    setOrder(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </FormField>

              {/* Duration */}
              <FormField label="Duration (minutes)" htmlFor="duration">
                <input
                  id="duration"
                  data-testid="field-duration"
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) =>
                    setDuration(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </FormField>

              {/* Tags */}
              <FormField label="Tags (comma-separated)" htmlFor="tags">
                <input
                  id="tags"
                  data-testid="field-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="prompt, basics, getting-started"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                />
              </FormField>

              {/* Publish toggle */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="published"
                  className="text-sm font-medium text-foreground"
                >
                  {published ? "Published" : "Draft"}
                </label>
                <button
                  id="published"
                  role="switch"
                  aria-checked={published}
                  data-testid="field-published"
                  onClick={() => setPublished(!published)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer",
                    published ? "bg-green" : "bg-surface-3"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                      published ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                data-testid="save-button"
                onClick={handleSave}
                disabled={saving}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  "bg-accent text-background hover:bg-accent/90",
                  "disabled:opacity-50 disabled:pointer-events-none"
                )}
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                data-testid="preview-button"
                onClick={() => setShowPreview(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:border-border-accent transition-colors"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Preview modal */}
        {showPreview && (
          <ContentPreview
            title={title}
            difficulty={difficulty}
            duration={duration}
            content={content}
            quizQuestions={quizQuestions.map((q, idx) => ({
              id: `q-${idx + 1}`,
              question: q.question,
              options: q.options.map((o) => o.text),
              correct: q.correctIndex,
              explanation: q.explanation,
            }))}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </AdminGuard>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
