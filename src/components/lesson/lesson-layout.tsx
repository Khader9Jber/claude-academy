import type { ReactNode } from "react";

interface LessonLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
  toc?: ReactNode;
}

export function LessonLayout({ sidebar, content, toc }: LessonLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left sidebar - lesson list */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col border-r border-border bg-surface overflow-y-auto sticky top-0 h-screen">
        <div className="p-4">{sidebar}</div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {content}
        </div>
      </main>

      {/* Right sidebar - table of contents */}
      {toc && (
        <aside className="hidden xl:flex xl:w-56 shrink-0 flex-col border-l border-border overflow-y-auto sticky top-0 h-screen">
          <div className="p-4">{toc}</div>
        </aside>
      )}
    </div>
  );
}
