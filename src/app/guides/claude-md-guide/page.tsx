"use client";

import {
  FileText,
  Target,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Layers,
  TestTube2,
  GitFork,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Data ───────────────────────────────────────────────────────────── */

const ANATOMY_SECTIONS = [
  {
    title: "1. Project Identity",
    body: "What this project IS in one paragraph. Tech stack, purpose, where it lives in your org.",
    example: `## What This Is
A Next.js 15 e-commerce storefront for handmade ceramics. Talks to a Supabase backend for products/orders/auth. Deployed to Vercel. Used by ~500 daily visitors.`,
  },
  {
    title: "2. Build & Run Commands",
    body: "The EXACT commands. Not 'npm run dev probably' — the verified, current commands. Update this every time package.json changes.",
    example: `## Commands
\`\`\`bash
npm run dev       # Local at :3000
npm run build     # Production build
npm test          # Vitest unit tests (127 tests)
npm run test:e2e  # Playwright E2E (needs services up)
npm run lint      # ESLint + TypeScript check
\`\`\``,
  },
  {
    title: "3. Architecture Rules",
    body: "The non-obvious conventions Claude can't infer from file structure alone. One rule per line.",
    example: `## Architecture
- Business logic in \`src/lib/\`, NEVER in components
- Server Components by default, \`"use client"\` only when needed
- Database queries only through \`src/lib/db.ts\` helpers
- All API routes use zod schemas from \`src/schemas/\``,
  },
  {
    title: "4. When Adding Features Recipes",
    body: "Numbered recipes for common tasks. Claude will follow them verbatim — this is where you enforce consistency.",
    example: `## When Adding a New Page
1. Create route in \`src/app/<path>/page.tsx\`
2. Add server action in \`src/app/<path>/actions.ts\`
3. Add test in \`tests/app/<path>.test.ts\`
4. Update sitemap.ts if public
5. Run \`npm run build\` to catch route conflicts`,
  },
  {
    title: "5. Gotchas & Known Quirks",
    body: "The thing that always trips people up. The legacy weirdness. The workaround that nobody documented.",
    example: `## Known Quirks
- Supabase RLS blocks admin queries — use \`supabase.auth.admin.*\` with service key
- Tailwind JIT misses classes in template strings — use \`clsx\` wrapper
- Next.js 15 App Router: dynamic imports don't hot-reload, restart dev server`,
  },
];

const TEMPLATES = [
  {
    id: "nextjs-app",
    name: "Next.js App",
    description: "Production Next.js 15 project with App Router, TypeScript, Tailwind, and Supabase backend.",
    content: `# [Project Name] — Project Briefing

## What This Is
Next.js 15 application with TypeScript, Tailwind CSS 4, and Supabase backend. Server Components by default.

## Commands
\`\`\`bash
npm run dev          # Local dev server on :3000
npm run build        # Production build
npm test             # Vitest unit tests
npm run test:e2e     # Playwright E2E tests
npm run lint         # ESLint + TypeScript check
\`\`\`

## Architecture Rules
- Server Components by default; \`"use client"\` only when you need browser APIs or interactivity
- Business logic lives in \`src/lib/\` — NEVER in components
- Database access only via \`src/lib/db/\` helpers (no direct Supabase calls in components)
- All forms use server actions in \`actions.ts\` colocated with the route
- Import alias: \`@/\` → \`src/\`

## File Conventions
- Routes: \`src/app/<path>/page.tsx\`
- Route-local components: \`src/app/<path>/_components/\` (underscore prefix = not a route)
- Shared UI primitives: \`src/components/ui/\`
- Shared sections: \`src/components/layout/\`
- Types: \`src/types/\` or colocated with the feature

## When Adding a Feature
1. Create route folder in \`src/app/\`
2. Add server action in \`actions.ts\` if writes are involved
3. Add types to \`src/types/\` or colocate
4. Write tests in \`tests/\` mirroring src/ path
5. Run \`npm run build\` to catch type errors

## Testing
- Unit: Vitest, colocated \`*.test.ts\` or in \`tests/\`
- E2E: Playwright in \`e2e/\`, POM pattern (e2e/pages/)
- Run one test: \`npm test -- -t "test name"\`

## Environment
- Dev: \`.env.local\` (gitignored)
- Production: Vercel env vars
- Required: \`NEXT_PUBLIC_SUPABASE_URL\`, \`SUPABASE_SERVICE_ROLE_KEY\` (server only)

## Gotchas
- Next.js 15 dynamic imports don't hot-reload — restart dev server after changes
- Supabase RLS blocks admin queries — use service role key in server actions only
- Tailwind JIT misses classes in template strings — prefer \`clsx\` or \`cn\` helper
`,
  },
  {
    id: "node-api",
    name: "Node.js API",
    description: "Express/Fastify REST API with TypeScript, layered architecture, and Prisma.",
    content: `# [API Name] — Project Briefing

## What This Is
REST API built with Fastify + TypeScript. Layered architecture: routes → controllers → services → repositories. Prisma for database access.

## Commands
\`\`\`bash
npm run dev                     # Nodemon with ts-node
npm run build                   # Compile to dist/
npm start                       # Run compiled code
npm test                        # Jest unit tests
npm run test:int                # Integration tests (needs DB)
npx prisma migrate dev          # Apply migrations
npx prisma studio               # DB UI
\`\`\`

## Architecture Rules
- Routes ONLY define URL paths — call controllers
- Controllers ONLY handle req/res shape — call services
- Services contain ALL business logic — call repositories
- Repositories ONLY handle DB queries — use Prisma

## When Adding an Endpoint
1. Define Zod schema in \`src/validators/<resource>.schema.ts\`
2. Add route in \`src/routes/<resource>.routes.ts\`
3. Add controller method in \`src/controllers/<resource>.controller.ts\`
4. Add service method in \`src/services/<resource>.service.ts\`
5. Add repository method if new DB access needed
6. Write integration test in \`tests/integration/<resource>.test.ts\`

## Naming
- Files: \`<resource>.<layer>.ts\` (e.g., \`users.service.ts\`)
- Classes: PascalCase
- Functions: camelCase
- DB tables: snake_case plural (e.g., \`user_sessions\`)

## Error Handling
- Throw typed errors from \`src/errors/\` in services
- Controllers catch and map to HTTP codes via \`error.middleware.ts\`
- NEVER leak stack traces in production responses

## Gotchas
- Prisma client is a singleton — import from \`src/lib/prisma.ts\`
- Migrations in CI require DATABASE_URL with direct connection (not pooled)
- Zod \`.strict()\` fails on extra fields — use \`.passthrough()\` for flexible payloads
`,
  },
  {
    id: "python-ml",
    name: "Python / ML Project",
    description: "Python package with poetry, pytest, and a src-layout. Suited for data science or ML workflows.",
    content: `# [Project Name] — Project Briefing

## What This Is
Python 3.11 package using Poetry for dependencies, src-layout for imports, pytest for testing. Primary purpose: [training/inference/data pipeline].

## Commands
\`\`\`bash
poetry install                   # Install dependencies
poetry run pytest                # Run all tests
poetry run pytest -k test_name   # Single test
poetry run ruff check .          # Lint
poetry run mypy src/             # Type check (strict)
poetry run python -m my_package  # Run as module
\`\`\`

## Architecture
- \`src/my_package/\` — main code (import as \`from my_package import ...\`)
- \`src/my_package/core/\` — algorithms, pure functions
- \`src/my_package/io/\` — file/network I/O
- \`src/my_package/cli.py\` — Typer CLI entry
- \`tests/unit/\` — fast unit tests
- \`tests/integration/\` — slow tests with fixtures
- \`notebooks/\` — exploration only, NEVER import from

## Rules
- Type hints on ALL public functions (mypy strict)
- Pure functions in \`core/\`, side effects in \`io/\`
- Data contracts via Pydantic models in \`src/my_package/schemas/\`
- NEVER import from \`notebooks/\` — it's for scratch work only

## When Adding a Feature
1. Write the test first in \`tests/unit/\`
2. Implement in \`src/my_package/core/\` (no I/O yet)
3. Add I/O wrappers in \`src/my_package/io/\` if needed
4. Wire into CLI in \`src/my_package/cli.py\`
5. Run \`mypy\` and \`ruff\` before committing

## Data
- Small fixtures: \`tests/fixtures/\` (committed)
- Large datasets: \`data/\` (gitignored, download script in \`scripts/fetch_data.py\`)
- Model artifacts: \`models/\` (gitignored, tracked with DVC)

## Gotchas
- Pytest collects from \`tests/\` only — don't put tests in \`src/\`
- Pydantic v2 syntax — NOT v1 (use \`model_validate\` not \`parse_obj\`)
- Poetry lockfile conflicts: \`poetry lock --no-update\` to refresh without upgrading
`,
  },
];

const DONT_INCLUDE = [
  {
    title: "Secrets, keys, credentials",
    text: "API keys, database URLs with passwords, auth tokens. CLAUDE.md is committed — treat it like a public README.",
  },
  {
    title: "Entire files of code",
    text: "CLAUDE.md is context, not source. If you need Claude to see a file, reference it with @path/to/file in your prompt.",
  },
  {
    title: "Outdated commands",
    text: "A stale \"npm start\" that nobody runs anymore teaches Claude the wrong habit. Audit CLAUDE.md every quarter.",
  },
  {
    title: "Obvious stuff",
    text: "\"This is a React project\" — Claude can see that from package.json. Spend tokens on the non-obvious conventions.",
  },
  {
    title: "Personal preferences without rationale",
    text: "\"I like tabs\" isn't useful. \"We use tabs because the team uses tabs — enforced by prettier\" is.",
  },
  {
    title: "Aspirational rules",
    text: "\"We will have 100% test coverage\" — if it's not true today, don't write it. Claude will try to enforce it and fail.",
  },
];

const ANTIPATTERNS = [
  {
    title: "The novel",
    text: "CLAUDE.md that's 2,000 lines long. Claude reads it every session — you're burning tokens. Target 150-400 lines.",
  },
  {
    title: "The tutorial",
    text: "Explaining what React is, how TypeScript works, what Docker does. Claude knows these. Write project-specific rules only.",
  },
  {
    title: "The lie",
    text: "Rules that don't match the code. If CLAUDE.md says \"services in src/services/\" but half your logic lives in components, fix the code OR the doc.",
  },
  {
    title: "The dump",
    text: "Pasting your ADR, your README, your onboarding doc, your Confluence page. Synthesize — extract the 10 rules that matter.",
  },
  {
    title: "The empty file",
    text: "No CLAUDE.md or a stub with just the project name. You're leaving 40%+ of Claude's potential on the table.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function ClaudeMdGuidePage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-claude-md-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <FileText className="h-4 w-4" />
            Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            The Complete CLAUDE.md Guide
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            CLAUDE.md is the single highest-leverage file in your repo. A great
            one saves hours per week. A bad one poisons every prompt. Here&apos;s
            how to write one worth reading.
          </p>
        </div>
      </section>

      {/* Why it matters */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Why CLAUDE.md matters
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                CLAUDE.md is a persistent briefing that Claude reads at the start
                of every session in your repo. It&apos;s the difference between
                Claude guessing your conventions (and getting them wrong) and
                Claude knowing them cold.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Good CLAUDE.md saves you from repeating yourself. You don&apos;t
                tell Claude &quot;remember, business logic goes in lib/&quot; every
                morning — you write it once, in CLAUDE.md, and it sticks for
                every session and every teammate who uses the repo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* Anatomy */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Anatomy
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Anatomy of a great CLAUDE.md
              </h2>
              <p className="text-muted">
                Five sections, in this order. Everything else is optional.
              </p>
            </div>
            <div className="space-y-5">
              {ANATOMY_SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="border border-border rounded-xl bg-surface overflow-hidden"
                >
                  <div className="p-5 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {section.body}
                    </p>
                  </div>
                  <div className="bg-surface-2 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted uppercase tracking-wide">
                        Example
                      </span>
                      <CopyButton text={section.example} />
                    </div>
                    <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed">
                      <code>{section.example}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What to include / exclude */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="border border-green/30 bg-green/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green" />
                Include
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex gap-2">
                  <span className="text-green shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Build commands</strong>{" "}
                    — the exact, current commands you run daily
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Conventions</strong> —
                    naming, structure, import paths, style rules Claude
                    can&apos;t infer
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Architecture rules</strong>{" "}
                    — layering, boundaries, what CAN&apos;T import from what
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Feature recipes</strong>{" "}
                    — numbered steps for common tasks (&quot;when adding X,
                    do Y&quot;)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Gotchas</strong> — the
                    non-obvious traps nobody else documented
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Key files</strong> —
                    pointers to the docs Claude should read for specific tasks
                  </span>
                </li>
              </ul>
            </div>

            <div className="border border-red/30 bg-red/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red" />
                Exclude
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                {DONT_INCLUDE.map((item) => (
                  <li key={item.title} className="flex gap-2">
                    <span className="text-red shrink-0">✗</span>
                    <span>
                      <strong className="text-foreground">{item.title}</strong>{" "}
                      — {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Templates */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                Templates
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Real-world templates
              </h2>
              <p className="text-muted">
                Copy, paste, and adapt. Each template is based on real production
                CLAUDE.md files we&apos;ve audited and refined.
              </p>
            </div>
            <div className="space-y-6">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="border border-border rounded-2xl bg-surface overflow-hidden"
                >
                  <div className="p-5 sm:p-6 border-b border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {tpl.name}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>
                      <CopyButton text={tpl.content} />
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 bg-surface-2/30">
                    <pre className="text-xs text-foreground/90 font-mono bg-surface p-4 rounded-lg overflow-x-auto leading-relaxed border border-border max-h-96">
                      <code>{tpl.content}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Anti-patterns */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Anti-patterns
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Common anti-patterns
              </h2>
              <p className="text-muted">
                Every CLAUDE.md we&apos;ve seen fail in production fell into one
                of these.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {ANTIPATTERNS.map((ap) => (
                <div
                  key={ap.title}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {ap.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {ap.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testing */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <TestTube2 className="h-3.5 w-3.5 mr-1" />
                Testing
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Testing your CLAUDE.md
              </h2>
              <p className="text-muted">
                A CLAUDE.md isn&apos;t done when you commit it — it&apos;s done
                when it passes these tests.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-6 space-y-5">
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono text-sm shrink-0 mt-0.5">
                  01
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    The newcomer test
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Give CLAUDE.md to a developer who&apos;s never seen your
                    project. Can they set up, run tests, and know where to add
                    a feature? If not, your CLAUDE.md isn&apos;t complete.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono text-sm shrink-0 mt-0.5">
                  02
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    The cold-start test
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Clear your Claude context and ask &quot;add a new
                    endpoint.&quot; Does Claude follow your recipe? If it
                    wanders or guesses, your recipe isn&apos;t specific enough.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono text-sm shrink-0 mt-0.5">
                  03
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    The 30-day audit
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Once a month, read CLAUDE.md top-to-bottom. Delete stale
                    lines, update commands that drifted, add rules you found
                    yourself repeating in prompts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono text-sm shrink-0 mt-0.5">
                  04
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    The token-count test
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Under 500 lines. Under ~4k tokens. If you&apos;re over, cut
                    obvious stuff, link to docs instead of inlining them, or
                    split into multi-file CLAUDE.md.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Multi-file */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <GitFork className="h-3.5 w-3.5 mr-1" />
                Monorepo
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Multi-file CLAUDE.md for monorepos
              </h2>
              <p className="text-muted">
                In large monorepos, one CLAUDE.md can&apos;t cover everything.
                Split by scope.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-4">
              <p className="text-sm text-muted leading-relaxed">
                Claude Code walks up the directory tree looking for{" "}
                <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground">
                  CLAUDE.md
                </code>{" "}
                files and merges them, with closer files taking precedence. You
                can have:
              </p>
              <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
                <code>{`my-monorepo/
├── CLAUDE.md                    # Root: monorepo-wide rules
├── apps/
│   ├── web/
│   │   ├── CLAUDE.md            # Web app specifics (Next.js rules)
│   │   └── src/
│   ├── api/
│   │   ├── CLAUDE.md            # API specifics (Fastify rules)
│   │   └── src/
│   └── mobile/
│       ├── CLAUDE.md            # Mobile specifics (RN rules)
│       └── src/
└── packages/
    ├── ui/
    │   └── CLAUDE.md            # Shared UI library rules
    └── db/
        └── CLAUDE.md            # Prisma schema + migration rules`}</code>
              </pre>
              <div className="border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">
                    Pro tip
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Keep the root CLAUDE.md focused on things that apply to the
                    WHOLE monorepo (workspace commands, shared conventions). Put
                    app-specific rules in the app&apos;s CLAUDE.md. Claude loads
                    both — less repetition, clearer ownership.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final callout */}
          <section>
            <div
              className={cn(
                "border border-accent/30 bg-accent/5 rounded-2xl p-6 sm:p-8"
              )}
            >
              <h2 className="text-xl font-bold text-foreground mb-3 font-serif italic">
                The one-line summary
              </h2>
              <p className="text-muted leading-relaxed">
                A great CLAUDE.md is short, current, and tells Claude the things
                it can&apos;t figure out by reading the code. Everything else is
                noise.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
