import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";
import { getModules, getModule, getLesson } from "@/lib/content";
import { Breadcrumb } from "@/components/layout";
import { LessonSidebar } from "./lesson-sidebar";
import { MarkCompleteButton } from "./mark-complete";

const difficultyColors: Record<string, string> = {
  beginner: "bg-green/10 text-green border-green/20",
  intermediate: "bg-blue/10 text-blue border-blue/20",
  advanced: "bg-purple/10 text-purple border-purple/20",
  expert: "bg-accent/10 text-accent border-accent/20",
};

export async function generateStaticParams() {
  const modules = getModules();
  const allParams: { moduleSlug: string; lessonSlug: string }[] = [];

  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      allParams.push({
        moduleSlug: mod.slug,
        lessonSlug: lesson.slug,
      });
    }
  }

  return allParams;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const mod = getModule(moduleSlug);
  const lesson = getLesson(moduleSlug, lessonSlug);

  if (!mod || !lesson) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
        <Link href="/curriculum" className="text-accent hover:underline">
          Back to Curriculum
        </Link>
      </div>
    );
  }

  // Find prev/next lessons
  const lessonIndex = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = lessonIndex > 0 ? mod.lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < mod.lessons.length - 1
      ? mod.lessons[lessonIndex + 1]
      : null;

  // Extract headings from content for a simple TOC
  const headings = lesson.content
    .split("\n")
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => {
      const level = line.match(/^(#{2,3})/)?.[1].length ?? 2;
      const text = line.replace(/^#{2,3}\s+/, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return { level, text, id };
    });

  const lessonId = `${moduleSlug}/${lessonSlug}`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: mod.title, href: `/curriculum/${moduleSlug}` },
          { label: lesson.title },
        ]}
        className="mb-6"
      />

      <div className="flex gap-8">
        {/* Left sidebar - lesson navigation */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <LessonSidebar module={mod} currentLessonSlug={lessonSlug} />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {/* Lesson header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
                  difficultyColors[lesson.difficulty]
                )}
              >
                {lesson.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(lesson.duration)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {lesson.title}
            </h1>

            {/* Learning objectives */}
            {lesson.objectives.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-5 mb-6">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                  Learning Objectives
                </h2>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj) => (
                    <li
                      key={obj}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <BookOpen
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: mod.color }}
                      />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Content area */}
          <div className="prose mb-12">
            {lesson.content.trim() ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: simpleMarkdownToHtml(lesson.content),
                }}
              />
            ) : (
              <div className="text-center py-16 text-muted">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Content Coming Soon
                </h2>
                <p>
                  This lesson&apos;s content is being developed. Check back
                  soon for the full material.
                </p>
              </div>
            )}
          </div>

          {/* Mark as complete */}
          <div className="mb-8">
            <MarkCompleteButton lessonId={lessonId} color={mod.color} />
          </div>

          {/* Prev/Next navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            {prevLesson ? (
              <Link
                href={`/curriculum/${moduleSlug}/${prevLesson.slug}`}
                className={cn(
                  "flex items-center gap-2 text-sm text-muted hover:text-foreground",
                  "transition-colors"
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                <div className="text-left">
                  <span className="text-xs text-muted block">
                    Previous Lesson
                  </span>
                  <span className="font-medium">{prevLesson.title}</span>
                </div>
              </Link>
            ) : (
              <Link
                href={`/curriculum/${moduleSlug}`}
                className={cn(
                  "flex items-center gap-2 text-sm text-muted hover:text-foreground",
                  "transition-colors"
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Module</span>
              </Link>
            )}
            {nextLesson ? (
              <Link
                href={`/curriculum/${moduleSlug}/${nextLesson.slug}`}
                className={cn(
                  "flex items-center gap-2 text-sm text-muted hover:text-foreground",
                  "transition-colors"
                )}
              >
                <div className="text-right">
                  <span className="text-xs text-muted block">Next Lesson</span>
                  <span className="font-medium">{nextLesson.title}</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`/curriculum/${moduleSlug}`}
                className={cn(
                  "flex items-center gap-2 text-sm text-muted hover:text-foreground",
                  "transition-colors"
                )}
              >
                <span className="font-medium">Module Complete</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Right sidebar - table of contents */}
        <div className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            {headings.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  On this page
                </h3>
                <nav className="space-y-1">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={cn(
                        "block text-sm text-muted hover:text-foreground transition-colors py-1",
                        heading.level === 3 && "pl-3"
                      )}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple markdown to HTML converter for lesson content.
 * This is a basic fallback; a proper MDX pipeline would be used in production.
 */
function simpleMarkdownToHtml(markdown: string): string {
  let html = markdown
    // Code blocks
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (_match, _lang, code) =>
        `<pre><code>${escapeHtml(code.trim())}</code></pre>`
    )
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Headings
    .replace(/^### (.+)$/gm, (_, text) => {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return `<h3 id="${id}">${text}</h3>`;
    })
    .replace(/^## (.+)$/gm, (_, text) => {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return `<h2 id="${id}">${text}</h2>`;
    })
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr />")
    // Paragraphs (lines not already wrapped)
    .replace(
      /^(?!<[hluobp]|<\/|<hr|<pre|<code|<li|<blockquote)(.+)$/gm,
      "<p>$1</p>"
    );

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(
    /(<li>.*?<\/li>\n?)+/g,
    (match) => `<ul>${match}</ul>`
  );

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
