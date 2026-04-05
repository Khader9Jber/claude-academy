"use client";

import { useState, useMemo } from "react";
import {
  FileCode,
  Settings,
  Webhook,
  Bot,
  Play,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TemplateCategory =
  | "CLAUDE.md"
  | "Settings"
  | "Hooks"
  | "Agents"
  | "Custom Commands";

interface ConfigTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  language: string;
  code: string;
}

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

const CATEGORY_META: Record<
  TemplateCategory,
  { icon: React.ReactNode; variant: "green" | "blue" | "purple" | "orange" | "accent" }
> = {
  "CLAUDE.md": { icon: <FileCode className="h-4 w-4" />, variant: "green" },
  Settings: { icon: <Settings className="h-4 w-4" />, variant: "blue" },
  Hooks: { icon: <Webhook className="h-4 w-4" />, variant: "purple" },
  Agents: { icon: <Bot className="h-4 w-4" />, variant: "orange" },
  "Custom Commands": { icon: <Play className="h-4 w-4" />, variant: "accent" },
};

const ALL_CATEGORIES: TemplateCategory[] = [
  "CLAUDE.md",
  "Settings",
  "Hooks",
  "Agents",
  "Custom Commands",
];

// ---------------------------------------------------------------------------
// Template data
// ---------------------------------------------------------------------------

const TEMPLATES: ConfigTemplate[] = [
  // ── CLAUDE.md Templates ──────────────────────────────────────────────
  {
    id: "claudemd-nodejs",
    title: "Node.js API",
    category: "CLAUDE.md",
    description:
      "CLAUDE.md for an Express/Fastify Node.js API project with TypeScript, Prisma ORM, and Jest testing.",
    language: "markdown",
    code: `# Project: Node.js API

## Build & Run
- \`npm run dev\` — start dev server with hot reload
- \`npm run build\` — compile TypeScript to dist/
- \`npm test\` — run Jest test suite
- \`npm run test:watch\` — run tests in watch mode
- \`npm run lint\` — ESLint check
- \`npm run typecheck\` — tsc --noEmit

## Code Style
- TypeScript strict mode, no \`any\` types
- Use named exports, not default exports
- Import order: node builtins > external > internal > relative
- Error handling: always use custom AppError class from src/lib/errors.ts
- Naming: camelCase for variables/functions, PascalCase for types/classes

## Project Structure
- src/routes/ — route handlers grouped by resource
- src/services/ — business logic layer
- src/models/ — Prisma schema + generated types
- src/middleware/ — Express/Fastify middleware
- src/lib/ — shared utilities and helpers
- src/__tests__/ — test files mirror src/ structure

## Patterns
- All route handlers must use the asyncHandler wrapper
- Database access only through service layer, never in routes
- Validate request bodies with Zod schemas in src/schemas/
- Return consistent response format: { data, error, meta }

## Don't
- Don't use console.log — use the logger from src/lib/logger.ts
- Don't commit .env files or hardcode secrets
- Don't use synchronous file operations
- Don't skip input validation on any endpoint`,
  },
  {
    id: "claudemd-react",
    title: "React Frontend",
    category: "CLAUDE.md",
    description:
      "CLAUDE.md for a React + Vite frontend project with Tailwind CSS, Zustand state management, and Vitest.",
    language: "markdown",
    code: `# Project: React Frontend

## Build & Run
- \`npm run dev\` — Vite dev server on :5173
- \`npm run build\` — production build to dist/
- \`npm run preview\` — preview production build
- \`npm run test\` — Vitest
- \`npm run lint\` — ESLint + Prettier check
- \`npm run typecheck\` — tsc --noEmit

## Code Style
- TypeScript strict, no \`any\`
- Functional components only, no class components
- Use named exports for components
- CSS: Tailwind utility classes, no inline styles or CSS modules
- One component per file, filename matches component name

## Project Structure
- src/components/ui/ — reusable primitives (Button, Input, Card)
- src/components/features/ — feature-specific components
- src/components/layout/ — page layout components
- src/pages/ — route-level page components
- src/hooks/ — custom React hooks
- src/stores/ — Zustand stores
- src/lib/ — utilities, API client, constants
- src/types/ — shared TypeScript types

## Patterns
- State management: Zustand for global, useState for local
- Data fetching: TanStack Query with hooks in src/hooks/queries/
- Forms: React Hook Form + Zod validation
- All API calls go through src/lib/api-client.ts
- Use \`cn()\` helper from src/lib/utils for conditional classes

## Don't
- Don't use useEffect for data fetching — use TanStack Query
- Don't prop drill more than 2 levels — use Zustand or context
- Don't put business logic in components — extract to hooks
- Don't use index as key in lists with dynamic items`,
  },
  {
    id: "claudemd-python",
    title: "Python Data Science",
    category: "CLAUDE.md",
    description:
      "CLAUDE.md for a Python data science project with pandas, scikit-learn, and Jupyter notebooks.",
    language: "markdown",
    code: `# Project: Python Data Science

## Environment
- Python 3.11+ with uv for package management
- \`uv sync\` — install dependencies
- \`uv run pytest\` — run tests
- \`uv run ruff check .\` — lint
- \`uv run ruff format .\` — format
- \`uv run mypy src/\` — type check

## Code Style
- Type hints on all function signatures
- Docstrings: Google style on all public functions
- Max line length: 88 (ruff default)
- Import order: stdlib > third-party > local (ruff handles this)
- Use pathlib.Path, not os.path

## Project Structure
- src/data/ — data loading and preprocessing
- src/features/ — feature engineering pipelines
- src/models/ — model training and evaluation
- src/utils/ — shared helpers
- notebooks/ — Jupyter notebooks (numbered: 01_, 02_)
- tests/ — pytest tests mirror src/ structure
- data/raw/ — original immutable data (gitignored)
- data/processed/ — cleaned datasets (gitignored)

## Patterns
- All data transformations are functions, not scripts
- Use sklearn Pipelines for ML workflows
- Config in src/config.py — no magic numbers in code
- Log experiments with MLflow
- Notebooks are for exploration only — production code goes in src/

## Don't
- Don't commit data files — use DVC or document download steps
- Don't use global state in data processing functions
- Don't use print() — use logging module
- Don't hardcode file paths — use config or CLI args`,
  },
  {
    id: "claudemd-fullstack",
    title: "Full-Stack Monorepo",
    category: "CLAUDE.md",
    description:
      "CLAUDE.md for a full-stack monorepo with a Next.js frontend, Express API, and shared packages.",
    language: "markdown",
    code: `# Project: Full-Stack Monorepo

## Build & Run
- \`pnpm install\` — install all workspace dependencies
- \`pnpm dev\` — start all packages in dev mode (Turborepo)
- \`pnpm build\` — build all packages
- \`pnpm test\` — run tests across all packages
- \`pnpm lint\` — lint all packages
- \`pnpm typecheck\` — typecheck all packages

## Workspace Structure
- apps/web/ — Next.js frontend (App Router)
- apps/api/ — Express API server
- packages/shared/ — shared types, utils, and validation schemas
- packages/ui/ — shared React component library
- packages/config/ — shared ESLint, TS, Tailwind configs

## Code Style
- TypeScript strict everywhere
- Shared types go in packages/shared/src/types/
- Validation schemas in packages/shared/src/schemas/ (Zod)
- Import from packages using workspace aliases: @repo/shared, @repo/ui

## Patterns
- API routes return typed responses matching packages/shared types
- Frontend uses TanStack Query for all API calls
- End-to-end type safety: Zod schema → TS type → API → Frontend
- Database migrations in apps/api/prisma/
- Environment variables documented in each app's .env.example

## Don't
- Don't import from apps/* into packages/* (dependency direction)
- Don't duplicate types — single source of truth in packages/shared
- Don't use relative imports across workspace boundaries
- Don't add dependencies to the root package.json (use workspace)`,
  },
  {
    id: "claudemd-mobile",
    title: "Mobile App (React Native)",
    category: "CLAUDE.md",
    description:
      "CLAUDE.md for a React Native (Expo) mobile app with TypeScript and React Navigation.",
    language: "markdown",
    code: `# Project: React Native Mobile App

## Build & Run
- \`npx expo start\` — start Expo dev server
- \`npx expo run:ios\` — build and run on iOS simulator
- \`npx expo run:android\` — build and run on Android emulator
- \`npm test\` — run Jest tests
- \`npm run lint\` — ESLint check
- \`npm run typecheck\` — tsc --noEmit

## Code Style
- TypeScript strict mode
- Functional components with hooks only
- Use StyleSheet.create(), not inline styles
- Organize styles at bottom of component file
- Use rem-like spacing scale: 4, 8, 12, 16, 24, 32, 48

## Project Structure
- src/screens/ — screen components (one per route)
- src/components/ — reusable UI components
- src/navigation/ — React Navigation config and types
- src/hooks/ — custom hooks
- src/stores/ — Zustand stores
- src/services/ — API client, storage, notifications
- src/lib/ — utilities, constants, theme
- src/types/ — shared TypeScript types

## Patterns
- Navigation typing: use RootStackParamList from src/navigation/types
- API calls through src/services/api.ts (Axios instance)
- Async storage wrapper in src/services/storage.ts
- Theme colors from src/lib/theme.ts — never hardcode colors
- Handle safe areas with SafeAreaView or useSafeAreaInsets

## Don't
- Don't use ScrollView for long lists — use FlatList or FlashList
- Don't hardcode dimensions — use Dimensions API or percentages
- Don't store sensitive data in AsyncStorage — use SecureStore
- Don't use platform-specific code without Platform.select()`,
  },

  // ── Settings.json Templates ──────────────────────────────────────────
  {
    id: "settings-permissive",
    title: "Permissive (Development)",
    category: "Settings",
    description:
      "A wide-open settings.json for local development. Allows all common tools without prompts.",
    language: "json",
    code: `{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(node *)",
      "Bash(git *)",
      "Bash(pnpm *)",
      "Bash(yarn *)",
      "Bash(bun *)",
      "Bash(cat *)",
      "Bash(ls *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Bash(curl *)",
      "mcp__*"
    ],
    "deny": []
  },
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "high"
  }
}`,
  },
  {
    id: "settings-locked",
    title: "Locked-Down (Production)",
    category: "Settings",
    description:
      "A restrictive settings.json for production environments. Read-only with limited commands.",
    language: "json",
    code: `{
  "permissions": {
    "allow": [
      "Read(src/**)",
      "Read(docs/**)",
      "Read(package.json)",
      "Bash(npm test)",
      "Bash(npm run lint)",
      "Bash(npm run typecheck)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)"
    ],
    "deny": [
      "Write",
      "Bash(rm *)",
      "Bash(npm publish *)",
      "Bash(git push *)",
      "Bash(git reset *)",
      "Bash(curl *)",
      "mcp__*"
    ]
  },
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "medium"
  }
}`,
  },
  {
    id: "settings-cicd",
    title: "CI/CD Pipeline",
    category: "Settings",
    description:
      "Settings for running Claude Code in automated CI/CD pipelines with GitHub Actions.",
    language: "json",
    code: `{
  "permissions": {
    "allow": [
      "Read",
      "Write(src/**)",
      "Write(tests/**)",
      "Bash(npm *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git push origin HEAD)",
      "Bash(gh pr create *)",
      "Bash(gh pr comment *)"
    ],
    "deny": [
      "Bash(git push --force *)",
      "Bash(git reset --hard *)",
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "mcp__*"
    ]
  },
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "high",
    "MAX_THINKING_TOKENS": "16000"
  }
}`,
  },

  // ── Hook Templates ───────────────────────────────────────────────────
  {
    id: "hook-format",
    title: "Auto-Format on Save (Prettier)",
    category: "Hooks",
    description:
      "Automatically run Prettier on any file Claude writes. Configured in .claude/settings.json.",
    language: "json",
    code: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\"",
            "timeout": 10000
          }
        ]
      }
    ]
  }
}`,
  },
  {
    id: "hook-notification",
    title: "Desktop Notification",
    category: "Hooks",
    description:
      "Send a native desktop notification when Claude finishes a task. Works on macOS and Linux.",
    language: "json",
    code: `{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"$CLAUDE_NOTIFICATION_MESSAGE\" with title \"Claude Code\"'",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}`,
  },
  {
    id: "hook-slack",
    title: "Slack Webhook",
    category: "Hooks",
    description:
      "Post a message to Slack when Claude completes a task. Replace the webhook URL with your own.",
    language: "json",
    code: `{
  "hooks": {
    "TaskCompleted": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST -H 'Content-type: application/json' --data '{\"text\":\"Claude Code completed a task: '\"$CLAUDE_TASK_SUMMARY\"'\"}' https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
            "timeout": 10000
          }
        ]
      }
    ]
  }
}`,
  },

  // ── Agent Templates ──────────────────────────────────────────────────
  {
    id: "agent-security",
    title: "Security Reviewer",
    category: "Agents",
    description:
      "An agent definition for a security-focused code reviewer that scans for vulnerabilities.",
    language: "markdown",
    code: `# Agent: Security Reviewer

## Role
You are a senior application security engineer performing a code review.

## Instructions
When reviewing code, check for these vulnerability categories in order:

1. **Injection** — SQL injection, XSS, command injection, LDAP injection
2. **Broken Authentication** — weak tokens, missing MFA logic, session fixation
3. **Sensitive Data Exposure** — secrets in code, PII in logs, missing encryption
4. **Broken Access Control** — missing auth checks, IDOR, privilege escalation
5. **Security Misconfiguration** — debug mode, default credentials, CORS issues
6. **Insecure Dependencies** — known CVEs, outdated packages

## Output Format
For each finding:
- **Severity**: Critical / High / Medium / Low
- **File**: path/to/file.ts:lineNumber
- **Issue**: One-sentence description
- **Evidence**: The vulnerable code snippet
- **Fix**: The corrected code snippet

## Constraints
- Only flag real issues, not theoretical ones
- Ignore style/formatting — focus purely on security
- If unsure about severity, explain your reasoning
- Always suggest a fix, not just the problem`,
  },
  {
    id: "agent-test-writer",
    title: "Test Writer",
    category: "Agents",
    description:
      "An agent definition for automatically generating comprehensive tests for your codebase.",
    language: "markdown",
    code: `# Agent: Test Writer

## Role
You are a senior QA engineer who writes thorough, maintainable tests.

## Instructions
When given code to test:

1. **Read** the source file and all its imports to understand the full interface
2. **Identify** the testing framework already in use (check package.json or existing tests)
3. **Write** tests covering:
   - Happy path (expected inputs produce expected outputs)
   - Edge cases (empty, null, undefined, boundary values)
   - Error handling (invalid inputs, thrown exceptions)
   - Integration points (mocked external dependencies)

## Output Format
- One test file per source file
- Use describe/it blocks with descriptive names
- Group tests by method or behavior
- Include setup/teardown when needed

## Constraints
- Match existing test patterns in the codebase
- Mock external dependencies, don't make real API calls
- Use factories or fixtures for test data, not inline objects
- Each test should be independent — no shared mutable state
- Test behavior, not implementation details
- Aim for >90% branch coverage`,
  },
  {
    id: "agent-docs",
    title: "Documentation Generator",
    category: "Agents",
    description:
      "An agent definition for generating and updating documentation from code.",
    language: "markdown",
    code: `# Agent: Documentation Generator

## Role
You are a technical writer who creates clear, developer-friendly documentation.

## Instructions
When asked to document code:

1. **Read** the source files and existing documentation
2. **Identify** public APIs, exported functions, types, and components
3. **Generate** documentation including:
   - Overview (what it does, when to use it)
   - Installation/setup steps
   - API reference with types and parameters
   - Usage examples (simple → advanced)
   - Common pitfalls and FAQ

## Output Format
- Use Markdown with proper heading hierarchy
- Code examples in fenced blocks with language tags
- Tables for parameter/return value documentation
- Callout blocks for warnings and tips

## Constraints
- Write for the audience: assume they know the language, not the library
- Every public function needs at least one usage example
- Keep explanations concise — prefer examples over prose
- Use the project's existing documentation style if present
- Don't document private/internal functions unless asked`,
  },

  // ── Custom Command Templates ─────────────────────────────────────────
  {
    id: "cmd-fix-issue",
    title: "Fix Issue by Number",
    category: "Custom Commands",
    description:
      "A custom slash command that fetches a GitHub issue and creates a fix. Save as .claude/commands/fix-issue.md.",
    language: "markdown",
    code: `# /fix-issue

Fetch the GitHub issue #$ARGUMENTS from this repository.

Steps:
1. Read the issue title, description, and any comments using \`gh issue view\`
2. Understand the bug or feature request
3. Find the relevant code in the repository
4. Implement the fix or feature
5. Write or update tests to cover the change
6. Run the test suite to verify nothing is broken
7. Create a commit with a conventional commit message referencing the issue
8. Summarize what you changed and why

Constraints:
- Follow existing code patterns and style
- Don't modify unrelated files
- Keep the change minimal and focused
- If the issue is ambiguous, explain your interpretation before coding`,
  },
  {
    id: "cmd-deploy",
    title: "Deploy Pipeline",
    category: "Custom Commands",
    description:
      "A custom slash command that runs the full deploy pipeline. Save as .claude/commands/deploy.md.",
    language: "markdown",
    code: `# /deploy

Run the full deployment pipeline for this project.

Steps:
1. Run \`git status\` to check for uncommitted changes — abort if dirty
2. Run the full test suite: \`npm test\`
3. Run the linter: \`npm run lint\`
4. Run type checking: \`npm run typecheck\`
5. Build the project: \`npm run build\`
6. If all checks pass, show a summary of what will be deployed:
   - Current branch and latest commit
   - Number of commits ahead of main
   - List of changed files since last deploy tag
7. Ask for confirmation before proceeding
8. If confirmed: push to the deployment branch and create a deploy tag

Constraints:
- Never force push
- Never deploy from a branch other than main unless explicitly asked
- If any check fails, stop immediately and report the failure
- Log all commands and their output for debugging`,
  },
  {
    id: "cmd-pr-review",
    title: "PR Review",
    category: "Custom Commands",
    description:
      "A custom slash command for thorough pull request reviews. Save as .claude/commands/review-pr.md.",
    language: "markdown",
    code: `# /review-pr

Review the pull request at $ARGUMENTS (URL or number).

Steps:
1. Fetch the PR details using \`gh pr view\`
2. Read the full diff using \`gh pr diff\`
3. Check if the PR description explains the changes adequately
4. Review each changed file for:
   - **Correctness**: Does the code do what the PR claims?
   - **Security**: Any new vulnerabilities introduced?
   - **Performance**: Any regressions or missed optimizations?
   - **Testing**: Are changes adequately covered by tests?
   - **Style**: Does it follow the project's conventions?
5. Check if CI checks are passing using \`gh pr checks\`
6. Provide a structured review summary

Output format:
## Summary
[1-2 sentence overview]

## Blockers
[Issues that must be fixed before merge]

## Suggestions
[Improvements that would be nice but aren't blocking]

## Nits
[Minor style/preference items]

## Verdict
[Approve / Request Changes / Needs Discussion]`,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "All">("All");

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "All") return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <FileCode className="h-5 w-5" />
            </div>
            <Badge variant="accent">Copy & Paste</Badge>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground mb-4">
            Template Library
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Production-ready templates for CLAUDE.md files, settings, hooks, agents, and
            custom commands. Copy, paste, and customize for your project.
          </p>
        </div>
      </section>

      {/* Filters + Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory("All")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === "All"
                  ? "bg-accent text-background"
                  : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-accent"
              )}
            >
              <BookOpen className="h-4 w-4" />
              All ({TEMPLATES.length})
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const count = TEMPLATES.filter((t) => t.category === cat).length;
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeCategory === cat
                      ? "bg-accent text-background"
                      : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-accent"
                  )}
                >
                  {meta.icon}
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Templates */}
          <div className="space-y-6">
            {filteredTemplates.map((template) => (
              <TemplateBlock key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template block component
// ---------------------------------------------------------------------------

function TemplateBlock({ template }: { template: ConfigTemplate }) {
  const meta = CATEGORY_META[template.category];

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground text-lg">{template.title}</h3>
          <Badge variant={meta.variant}>{template.category}</Badge>
        </div>
        <CopyButton text={template.code} />
      </div>

      {/* Description */}
      <div className="px-5 py-3 border-b border-border bg-surface-2/50">
        <p className="text-sm text-muted">{template.description}</p>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-5 font-mono text-sm text-foreground leading-relaxed">
          <code>{template.code}</code>
        </pre>
      </div>
    </div>
  );
}
