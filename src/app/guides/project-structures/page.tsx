"use client";

import { useState, useMemo } from "react";
import {
  FolderTree,
  Search,
  Globe,
  Server,
  Smartphone,
  Database,
  Terminal,
  Package,
  Layers,
  Workflow,
  Lightbulb,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";

/* ── Types ──────────────────────────────────────────────────────────── */

type StructureCategory =
  | "Web Frontend"
  | "Backend API"
  | "Full-Stack"
  | "Mobile"
  | "CLI Tool"
  | "Python Project"
  | "Monorepo"
  | "Library/Package";

interface ProjectStructure {
  id: string;
  title: string;
  category: StructureCategory;
  description: string;
  stack: string[];
  tree: string;
  whyItWorks: string[];
  claudeMdTips: string;
  pitfalls?: string[];
}

const CATEGORY_META: Record<
  StructureCategory,
  { icon: React.ReactNode; color: string }
> = {
  "Web Frontend": { icon: <Globe className="h-4 w-4" />, color: "#5e9ed6" },
  "Backend API": { icon: <Server className="h-4 w-4" />, color: "#5cb870" },
  "Full-Stack": { icon: <Layers className="h-4 w-4" />, color: "#a07ed6" },
  Mobile: { icon: <Smartphone className="h-4 w-4" />, color: "#d6885e" },
  "CLI Tool": { icon: <Terminal className="h-4 w-4" />, color: "#5ec4c4" },
  "Python Project": {
    icon: <Workflow className="h-4 w-4" />,
    color: "#d4a053",
  },
  Monorepo: { icon: <Package className="h-4 w-4" />, color: "#d65ea0" },
  "Library/Package": {
    icon: <Database className="h-4 w-4" />,
    color: "#e06c75",
  },
};

const ALL_CATEGORIES: StructureCategory[] = [
  "Web Frontend",
  "Backend API",
  "Full-Stack",
  "Mobile",
  "CLI Tool",
  "Python Project",
  "Monorepo",
  "Library/Package",
];

/* ── Data: Project Structures ───────────────────────────────────────── */

const STRUCTURES: ProjectStructure[] = [
  {
    id: "nextjs-app-router",
    title: "Next.js 15 App Router",
    category: "Full-Stack",
    description:
      "Modern Next.js project with App Router, TypeScript, Tailwind, and colocated components. Optimized for Claude's file discovery.",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "App Router"],
    tree: `my-nextjs-app/
├── CLAUDE.md                    # Project briefing for Claude
├── .claudeignore                # Files Claude should skip
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── public/
│   └── images/
├── src/
│   ├── app/                     # Routes (file-based)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/              # Route groups
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── _components/    # Page-specific components
│   │   └── api/
│   │       └── users/route.ts
│   ├── components/             # Shared components
│   │   ├── ui/                 # Primitives (Button, Card)
│   │   └── layout/             # Header, Footer, Sidebar
│   ├── lib/                    # Utilities and business logic
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   └── styles/                 # Additional CSS modules
├── tests/                      # Tests mirror src/ structure
│   └── app/
└── docs/                       # Architecture decisions, ADRs`,
    whyItWorks: [
      "Colocated `_components/` folders keep page-specific code near the route — Claude finds relevant files faster",
      "`src/` prefix separates app code from config — Claude won't waste tokens reading package.json on every request",
      "Flat `components/ui/` primitives layer makes import paths predictable",
      "Tests mirror src/ structure so Claude can infer test file locations",
    ],
    claudeMdTips: `## Project: Next.js 15 App Router

## Build & Run
- \`npm run dev\` — dev server on :3000
- \`npm run build\` — production build
- \`npm test\` — Vitest unit tests
- \`npm run test:e2e\` — Playwright E2E tests

## Key Conventions
- Components live in \`src/components/ui/\` (primitives) and \`src/components/layout/\` (sections)
- Page-specific components go in \`_components/\` inside the route folder
- Business logic in \`src/lib/\`, NOT in components
- All files use TypeScript (no .js/.jsx)
- Use Tailwind utilities, no CSS modules except in \`src/styles/\`

## Import Paths
- Use \`@/\` alias (configured in tsconfig.json)
- Example: \`import { Button } from "@/components/ui/button"\`

## When Adding Features
- Create a new route folder in \`src/app/\`
- Add types to \`src/types/\`
- Add shared logic to \`src/lib/\`
- Write tests in \`tests/\` mirroring the src/ path`,
    pitfalls: [
      "Don't put components directly in `src/app/` — use `_components/` with underscore prefix to avoid route creation",
      "Avoid deeply nested folders beyond 4 levels — Claude struggles with file discovery in deep trees",
      "Don't mix server and client components in the same file",
    ],
  },
  {
    id: "express-api",
    title: "Express/Fastify Node.js API",
    category: "Backend API",
    description:
      "Production-grade Node.js REST API with layered architecture: routes → controllers → services → repositories.",
    stack: ["Node.js 20+", "Express/Fastify", "TypeScript", "Prisma", "Jest"],
    tree: `my-api/
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── index.ts                 # Entry point
│   ├── app.ts                   # Express app setup
│   ├── config/
│   │   ├── env.ts               # Validated env vars
│   │   └── database.ts
│   ├── routes/                  # HTTP route definitions
│   │   ├── users.routes.ts
│   │   └── auth.routes.ts
│   ├── controllers/             # Request/response handling
│   │   ├── users.controller.ts
│   │   └── auth.controller.ts
│   ├── services/                # Business logic
│   │   ├── users.service.ts
│   │   └── auth.service.ts
│   ├── repositories/            # Database access
│   │   └── users.repository.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── validators/              # Zod schemas
│   │   └── users.schema.ts
│   ├── types/
│   └── utils/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
└── docs/`,
    whyItWorks: [
      "Layered architecture (routes → controllers → services → repositories) gives Claude clear boundaries when adding features",
      "File naming convention `name.layer.ts` makes intent obvious from the filename alone",
      "Validators colocated by domain, not grouped by type — easier for Claude to find related schemas",
      "`prisma/` at the root is discoverable by Claude without explicit hints",
    ],
    claudeMdTips: `## Project: REST API

## Build & Run
- \`npm run dev\` — nodemon with ts-node
- \`npm run build\` — tsc to dist/
- \`npm start\` — run compiled code
- \`npm test\` — Jest unit tests
- \`npm run test:int\` — integration tests (needs DB)
- \`npx prisma migrate dev\` — apply migrations

## Architecture Rules
- Routes define URL paths only — call controllers
- Controllers handle req/res — call services
- Services contain business logic — call repositories
- Repositories handle DB queries — use Prisma

## When Adding an Endpoint
1. Define Zod schema in \`validators/\`
2. Add route in \`routes/\`
3. Add controller method in \`controllers/\`
4. Add service method in \`services/\`
5. Add repository method if new DB access needed
6. Add test in \`tests/integration/\`

## Naming
- Files: \`resource.layer.ts\` (e.g., users.service.ts)
- Exports: PascalCase for classes, camelCase for functions`,
    pitfalls: [
      "Don't put business logic in controllers — it belongs in services",
      "Don't skip the validator layer — unvalidated input reaches services",
      "Avoid `utils.ts` kitchen-sink files — split by domain",
    ],
  },
  {
    id: "python-fastapi",
    title: "FastAPI Python Project",
    category: "Python Project",
    description:
      "Modern Python API with FastAPI, SQLAlchemy, Alembic migrations, and pytest. Uses pyproject.toml and src-layout.",
    stack: ["Python 3.11+", "FastAPI", "SQLAlchemy", "Alembic", "pytest"],
    tree: `my-python-api/
├── CLAUDE.md
├── pyproject.toml               # Dependencies + build config
├── README.md
├── .env.example
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/                # Migration files
├── src/
│   └── my_api/                  # Import name (snake_case)
│       ├── __init__.py
│       ├── main.py              # FastAPI app entry
│       ├── config.py            # Settings with Pydantic
│       ├── database.py
│       ├── api/
│       │   ├── __init__.py
│       │   ├── deps.py          # Dependency injection
│       │   └── v1/
│       │       ├── users.py
│       │       └── auth.py
│       ├── models/              # SQLAlchemy ORM models
│       │   ├── __init__.py
│       │   └── user.py
│       ├── schemas/             # Pydantic schemas
│       │   └── user.py
│       ├── services/            # Business logic
│       │   └── user_service.py
│       ├── repositories/
│       │   └── user_repo.py
│       └── core/
│           ├── security.py
│           └── exceptions.py
├── tests/
│   ├── conftest.py
│   ├── unit/
│   └── integration/
└── scripts/`,
    whyItWorks: [
      "`src/` layout (src-layout) prevents import issues during testing — Claude won't accidentally import the wrong version",
      "Separate `models/` (SQLAlchemy) from `schemas/` (Pydantic) — avoids confusion between ORM and API types",
      "Versioned API folders (`v1/`) support multi-version APIs cleanly",
      "`conftest.py` at tests/ root provides shared fixtures — Claude picks this up automatically for test generation",
    ],
    claudeMdTips: `## Project: Python FastAPI Service

## Build & Run
- \`uvicorn src.my_api.main:app --reload\` — dev server
- \`pytest\` — all tests
- \`pytest tests/unit -k test_name\` — single test
- \`alembic revision --autogenerate -m "msg"\` — new migration
- \`alembic upgrade head\` — apply migrations
- \`ruff check .\` — lint
- \`mypy src/\` — type check

## Conventions
- Import paths: \`from my_api.services.user_service import ...\`
- Use type hints on ALL functions (enforced by mypy strict)
- Use Pydantic models for request/response validation
- Use SQLAlchemy models for DB only — NEVER return them from API

## When Adding Features
1. Add/modify SQLAlchemy model in \`models/\`
2. Create migration: \`alembic revision --autogenerate\`
3. Add Pydantic schemas in \`schemas/\`
4. Add repository method in \`repositories/\`
5. Add service method in \`services/\`
6. Add FastAPI route in \`api/v1/\`
7. Add tests in \`tests/\``,
    pitfalls: [
      "Don't return SQLAlchemy models from FastAPI endpoints — always convert to Pydantic schemas",
      "Don't use `requirements.txt` with pyproject.toml — pick one",
      "Avoid circular imports by keeping models/schemas separate",
    ],
  },
  {
    id: "monorepo-turborepo",
    title: "Turborepo Monorepo",
    category: "Monorepo",
    description:
      "Multi-package monorepo with shared UI library, API, web app, and mobile app. Uses pnpm workspaces and Turborepo for caching.",
    stack: ["Turborepo", "pnpm", "TypeScript", "Next.js", "React Native"],
    tree: `my-monorepo/
├── CLAUDE.md                    # Top-level briefing
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json                # Base TS config
├── apps/
│   ├── web/                     # Next.js web app
│   │   ├── CLAUDE.md            # App-specific rules
│   │   ├── package.json
│   │   └── src/
│   ├── mobile/                  # React Native (Expo)
│   │   ├── CLAUDE.md
│   │   └── app/
│   ├── api/                     # Backend API
│   │   ├── CLAUDE.md
│   │   └── src/
│   └── docs/                    # Docs site (Next.js)
├── packages/
│   ├── ui/                      # Shared React components
│   │   ├── package.json
│   │   └── src/
│   ├── config/                  # Shared configs
│   │   ├── eslint/
│   │   ├── tsconfig/
│   │   └── tailwind/
│   ├── types/                   # Shared TypeScript types
│   │   └── src/
│   ├── db/                      # Shared Prisma schema + client
│   │   ├── schema.prisma
│   │   └── src/
│   └── utils/                   # Shared utilities
└── docs/                        # Monorepo-level docs`,
    whyItWorks: [
      "Nested CLAUDE.md files let Claude load app-specific rules when working in that app's directory",
      "Shared packages (`packages/`) have clear naming — Claude knows `@repo/ui` means packages/ui",
      "Config package (`packages/config/`) centralizes tooling — one place to update ESLint, TS, Tailwind",
      "Apps don't import from each other, only from `packages/` — prevents circular deps",
    ],
    claudeMdTips: `## Monorepo Workspace Structure

## Layout
- \`apps/\` — deployable applications (web, mobile, api)
- \`packages/\` — shared libraries (ui, types, utils, config, db)

## Commands (from root)
- \`pnpm dev\` — run all apps in parallel (Turborepo)
- \`pnpm dev --filter=web\` — run only the web app
- \`pnpm build\` — build everything with cache
- \`pnpm test\` — run all tests
- \`pnpm lint\` — lint all packages

## Package Naming
- All internal packages use \`@repo/*\` prefix
- Examples: \`@repo/ui\`, \`@repo/types\`, \`@repo/db\`

## When Adding Shared Code
- New shared component → \`packages/ui/\`
- New shared type → \`packages/types/\`
- Used by ONE app only → keep it in that app
- **Don't** add new packages unless code is truly shared

## When Working on an App
- cd into the app folder and read its CLAUDE.md
- App-specific rules override root CLAUDE.md`,
    pitfalls: [
      "Don't import from `apps/*` into another app — only `packages/*` are shareable",
      "Don't create a package for code used by only one app",
      "Avoid publishing packages to npm unless the monorepo is open-source",
    ],
  },
  {
    id: "react-native-expo",
    title: "React Native / Expo",
    category: "Mobile",
    description:
      "Cross-platform mobile app with Expo Router (file-based routing), Zustand state, and typed API client.",
    stack: ["Expo", "React Native", "TypeScript", "Zustand", "Expo Router"],
    tree: `my-rn-app/
├── CLAUDE.md
├── app.json                     # Expo config
├── package.json
├── tsconfig.json
├── app/                         # File-based routes (Expo Router)
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   └── settings.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── +not-found.tsx
├── src/
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Primitives (Button, Input)
│   │   └── screens/             # Screen-specific components
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   └── storage.ts           # AsyncStorage wrapper
│   ├── stores/                  # Zustand stores
│   ├── types/
│   └── theme/                   # Colors, typography, spacing
├── assets/                      # Images, fonts
├── tests/
└── e2e/                         # Detox tests`,
    whyItWorks: [
      "Separating `app/` (routes) from `src/` (logic) — Claude distinguishes navigation from implementation",
      "File-based routing in `app/` makes adding new screens obvious — create a file, get a route",
      "`theme/` folder centralizes design tokens — Claude applies consistent styling",
      "`e2e/` at root for Detox tests — Claude won't confuse them with unit tests in `tests/`",
    ],
    claudeMdTips: `## Project: React Native (Expo)

## Build & Run
- \`npx expo start\` — dev server with QR code
- \`npx expo start --ios\` — open iOS simulator
- \`npx expo start --android\` — open Android emulator
- \`npx expo prebuild\` — generate native code
- \`npm test\` — Jest unit tests
- \`detox test\` — E2E tests

## Platform Differences
- Use \`Platform.OS === 'ios'\` sparingly
- For big platform differences, use \`.ios.tsx\` / \`.android.tsx\` suffixes
- Prefer cross-platform libraries

## Styling
- Use \`StyleSheet.create()\` for performance
- Reference theme tokens from \`src/theme/\`
- NO inline styles except for dynamic values

## State Management
- Local state: useState
- Cross-component state: Zustand store in \`src/stores/\`
- Server state: TanStack Query (in \`src/lib/api.ts\`)`,
    pitfalls: [
      "Don't use web-only libraries — check RN compatibility first",
      "Don't store sensitive data in AsyncStorage — use expo-secure-store",
      "Avoid deeply nested navigators — 3 levels max",
    ],
  },
  {
    id: "cli-tool",
    title: "Node.js CLI Tool",
    category: "CLI Tool",
    description:
      "Command-line tool with subcommands, interactive prompts, and plugin architecture. Publishable to npm.",
    stack: ["Node.js", "TypeScript", "Commander.js", "Inquirer", "Chalk"],
    tree: `my-cli/
├── CLAUDE.md
├── package.json                 # "bin" field points to dist/cli.js
├── tsconfig.json
├── src/
│   ├── cli.ts                   # Entry point (#!/usr/bin/env node)
│   ├── commands/
│   │   ├── init.ts
│   │   ├── build.ts
│   │   ├── deploy.ts
│   │   └── index.ts             # Command registry
│   ├── lib/
│   │   ├── config.ts
│   │   ├── logger.ts            # Chalk + levels
│   │   └── fs-utils.ts
│   ├── prompts/                 # Interactive prompts
│   │   └── project.ts
│   └── types/
├── templates/                   # Files copied by the CLI
│   └── project-template/
├── tests/
├── bin/                         # Optional: shell wrappers
└── docs/`,
    whyItWorks: [
      "Separate `commands/` folder with one file per command — Claude adds new commands by creating a file",
      "Command registry pattern (`commands/index.ts`) keeps Commander setup clean",
      "`templates/` folder for scaffolding files — Claude copies them during `init` commands",
      "Logger abstraction in `lib/logger.ts` — consistent output formatting",
    ],
    claudeMdTips: `## Project: Node.js CLI Tool

## Build & Run
- \`npm run build\` — compile to dist/
- \`npm link\` — install globally for testing
- \`npm test\` — Jest tests
- \`npm publish\` — publish to npm (after build)

## CLI Usage
- \`mytool init\` — initialize project
- \`mytool build\` — build project
- \`mytool deploy\` — deploy

## Adding a Command
1. Create \`src/commands/my-command.ts\`
2. Export \`default\` function that takes program and options
3. Register in \`src/commands/index.ts\`
4. Add tests in \`tests/commands/\`

## Conventions
- Use chalk for colored output (logger.ts handles this)
- Use inquirer for prompts in \`src/prompts/\`
- Use commander for arg parsing (already set up)
- Exit codes: 0=success, 1=user error, 2=internal error`,
    pitfalls: [
      "Don't use synchronous fs methods — blocks the event loop for large files",
      "Don't write to stdout/stderr directly — use the logger",
      "Always handle SIGINT (Ctrl+C) cleanly",
    ],
  },
  {
    id: "npm-library",
    title: "TypeScript npm Library",
    category: "Library/Package",
    description:
      "Publishable npm package with TypeScript, dual ESM/CJS output, proper types, and tsup for bundling.",
    stack: ["TypeScript", "tsup", "Vitest", "changesets"],
    tree: `my-library/
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── tsup.config.ts               # Bundler config
├── README.md
├── LICENSE
├── .changeset/                  # Version management
├── src/
│   ├── index.ts                 # Public API (barrel export)
│   ├── core/                    # Internal implementation
│   │   ├── client.ts
│   │   └── utils.ts
│   ├── types/                   # Public types
│   │   └── index.ts
│   └── errors/
├── tests/
│   ├── unit/
│   └── fixtures/
├── examples/                    # Usage examples
│   ├── basic/
│   └── advanced/
├── dist/                        # Build output (gitignored)
└── docs/`,
    whyItWorks: [
      "`src/index.ts` as the only public API — Claude knows what to export and what to keep internal",
      "`examples/` folder doubles as integration tests — Claude can verify API usage",
      "Changesets workflow in `.changeset/` — Claude can generate version bumps",
      "Types exported alongside values — single `import` statement for users",
    ],
    claudeMdTips: `## Project: npm Library

## Build & Run
- \`npm run build\` — tsup builds ESM + CJS + .d.ts
- \`npm test\` — Vitest
- \`npm run test:coverage\` — with coverage
- \`npm link\` — link locally for testing in another project
- \`npx changeset\` — create a version bump

## Public API
- ONLY export from \`src/index.ts\`
- Internal code in \`src/core/\` is not exported
- Types exported explicitly from \`src/types/index.ts\`

## Breaking Changes
- Any change to \`src/index.ts\` or \`src/types/\` is potentially breaking
- Always run \`npx changeset\` for breaking/major/minor changes
- Document breaking changes in CHANGELOG.md

## When Adding Features
1. Implement in \`src/core/\`
2. Export from \`src/index.ts\` if public
3. Add types to \`src/types/\` if exposed
4. Write unit tests in \`tests/unit/\`
5. Add example in \`examples/\`
6. Run \`npx changeset\` to track the change`,
    pitfalls: [
      "Don't export internals — use `src/index.ts` as the sole public surface",
      "Don't commit `dist/` — build it in CI during publish",
      "Always dual-publish ESM + CJS for maximum compatibility",
    ],
  },
  {
    id: "react-spa-vite",
    title: "React SPA with Vite",
    category: "Web Frontend",
    description:
      "Client-side React app with Vite, React Router, TanStack Query, and feature-based folder structure.",
    stack: ["React 19", "Vite", "TypeScript", "React Router", "TanStack Query"],
    tree: `my-spa/
├── CLAUDE.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component + Router
│   ├── features/                # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   ├── dashboard/
│   │   └── profile/
│   ├── shared/
│   │   ├── components/          # Shared UI components
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   └── query-client.ts
│   │   └── types/
│   ├── routes/                  # Route definitions
│   │   └── index.tsx
│   └── styles/
├── tests/
└── e2e/`,
    whyItWorks: [
      "Feature-based structure (`features/auth/`, `features/dashboard/`) — Claude modifies related files together",
      "Each feature has its own `components/`, `hooks/`, `api.ts`, `types.ts` — high cohesion",
      "`shared/` clearly separates cross-feature code — Claude knows what's reusable",
      "Route definitions in `routes/` — Claude adds new pages here and connects them to features",
    ],
    claudeMdTips: `## Project: React SPA (Vite)

## Build & Run
- \`npm run dev\` — Vite dev server
- \`npm run build\` — production build to dist/
- \`npm run preview\` — preview production build
- \`npm test\` — Vitest
- \`npm run test:e2e\` — Playwright

## Feature-Based Architecture
- Each feature in \`src/features/<name>/\` is self-contained:
  - \`components/\` — feature-specific components
  - \`hooks/\` — feature-specific hooks
  - \`api.ts\` — API calls for this feature
  - \`types.ts\` — TypeScript types
- Shared code goes in \`src/shared/\`

## Rules
- Features CANNOT import from other features
- Features CAN import from \`shared/\`
- \`shared/\` CANNOT import from features
- If two features need the same thing, move it to \`shared/\`

## Adding a New Feature
1. Create \`src/features/new-feature/\` with the standard structure
2. Add route in \`src/routes/index.tsx\`
3. Add tests in \`tests/features/new-feature/\``,
    pitfalls: [
      "Don't let features import from each other — creates tight coupling",
      "Don't put everything in `shared/` — only truly shared code",
      "Avoid massive `utils.ts` files — split by domain",
    ],
  },
  {
    id: "django-project",
    title: "Django REST Framework",
    category: "Python Project",
    description:
      "Django project with DRF, apps by domain, custom user model, and pytest. Production-ready structure.",
    stack: ["Django 5", "DRF", "PostgreSQL", "pytest", "Celery"],
    tree: `my-django-project/
├── CLAUDE.md
├── pyproject.toml
├── manage.py
├── config/                      # Django settings
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── production.py
│   │   └── test.py
│   ├── urls.py
│   ├── wsgi.py
│   └── celery.py
├── apps/                        # All Django apps
│   ├── users/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py       # DRF serializers
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── signals.py
│   │   ├── tasks.py             # Celery tasks
│   │   ├── services.py          # Business logic
│   │   ├── tests/
│   │   │   ├── test_models.py
│   │   │   ├── test_views.py
│   │   │   └── conftest.py
│   │   └── migrations/
│   ├── products/
│   └── orders/
├── static/
├── templates/
└── docs/`,
    whyItWorks: [
      "Settings split by environment (`base`, `development`, `production`, `test`) — Claude doesn't mix prod and dev configs",
      "`apps/` prefix for all Django apps — Claude avoids polluting root directory",
      "Business logic in `services.py` — Claude keeps views thin",
      "Tests per app with their own `conftest.py` — Claude generates app-specific fixtures",
    ],
    claudeMdTips: `## Project: Django REST Framework

## Build & Run
- \`python manage.py runserver\` — dev server
- \`python manage.py migrate\` — apply migrations
- \`python manage.py makemigrations\` — create migrations
- \`python manage.py createsuperuser\` — admin user
- \`pytest\` — run tests
- \`celery -A config worker -l info\` — start worker

## App Structure
- Each domain gets its own app in \`apps/\`
- Apps use: models, serializers, views, urls, services
- NEVER put business logic in views — use \`services.py\`
- Long-running tasks go in \`tasks.py\` (Celery)

## Adding a Feature
1. If new domain: \`python manage.py startapp <name> apps/<name>\`
2. Add models to \`apps/<name>/models.py\`
3. Run \`makemigrations\` → \`migrate\`
4. Add serializers, views, urls
5. Register URL in \`config/urls.py\`
6. Add tests in \`apps/<name>/tests/\`

## Settings
- Base settings in \`config/settings/base.py\`
- Environment-specific overrides in dev/prod/test.py
- Use DJANGO_SETTINGS_MODULE env var`,
    pitfalls: [
      "Don't create apps outside `apps/` — keeps imports consistent",
      "Don't put model methods with business logic — use services",
      "Don't skip migrations — always run makemigrations after model changes",
    ],
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function ProjectStructuresPage() {
  const [activeCategory, setActiveCategory] = useState<
    StructureCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return STRUCTURES.filter((s) => {
      const matchesCategory =
        activeCategory === "All" || s.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.stack.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div
      className="min-h-screen bg-background"
      data-testid="project-structures-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <FolderTree className="h-4 w-4" />
            Project Structures
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Best Project Structures for Claude Code
          </h1>
          <p className="text-muted max-w-3xl mx-auto text-lg">
            Battle-tested folder structures that work exceptionally well with
            Claude Code. Each structure is optimized for how Claude discovers
            files, navigates code, and generates consistent implementations.
            Copy, adapt, and ship.
          </p>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">
                Why Project Structure Matters for Claude
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Claude Code works best when your file structure is predictable.
                A clear structure means Claude finds relevant files faster (less
                token spend), generates code that matches your conventions
                (fewer iterations), and makes confident edits (fewer bugs). A
                messy structure means Claude wastes tokens hunting for files
                and produces inconsistent results. These structures below have
                been tested across real production projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("All")}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  activeCategory === "All"
                    ? "bg-accent text-background"
                    : "bg-surface-2 text-muted hover:text-foreground hover:bg-surface-3"
                )}
              >
                All ({STRUCTURES.length})
              </button>
              {ALL_CATEGORIES.map((cat) => {
                const count = STRUCTURES.filter(
                  (s) => s.category === cat
                ).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      activeCategory === cat
                        ? "bg-accent text-background"
                        : "bg-surface-2 text-muted hover:text-foreground hover:bg-surface-3"
                    )}
                  >
                    {CATEGORY_META[cat].icon}
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search by stack or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Structures */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted">No structures match your filter.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filtered.map((structure) => {
                const meta = CATEGORY_META[structure.category];
                return (
                  <article
                    key={structure.id}
                    className="border border-border rounded-2xl bg-surface overflow-hidden"
                  >
                    {/* Header */}
                    <div className="border-b border-border p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge
                          className="text-xs inline-flex items-center gap-1"
                          style={{
                            backgroundColor: `${meta.color}15`,
                            color: meta.color,
                            borderColor: `${meta.color}30`,
                          }}
                        >
                          {meta.icon}
                          {structure.category}
                        </Badge>
                        {structure.stack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {structure.title}
                      </h2>
                      <p className="text-muted leading-relaxed">
                        {structure.description}
                      </p>
                    </div>

                    {/* Content grid */}
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Tree */}
                      <div className="border-b md:border-b-0 md:border-r border-border p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FolderTree className="h-4 w-4 text-accent" />
                            Folder Structure
                          </h3>
                          <CopyButton text={structure.tree} />
                        </div>
                        <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
                          <code>{structure.tree}</code>
                        </pre>
                      </div>

                      {/* Why it works */}
                      <div className="p-5 sm:p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green" />
                          Why This Works with Claude
                        </h3>
                        <ul className="space-y-2.5 mb-6">
                          {structure.whyItWorks.map((reason, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted leading-relaxed flex gap-2"
                            >
                              <span className="text-green shrink-0">→</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>

                        {structure.pitfalls && (
                          <>
                            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red" />
                              Common Pitfalls
                            </h3>
                            <ul className="space-y-2.5">
                              {structure.pitfalls.map((pit, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-muted leading-relaxed flex gap-2"
                                >
                                  <span className="text-red shrink-0">✗</span>
                                  <span>{pit}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>

                    {/* CLAUDE.md recommendations */}
                    <div className="border-t border-border p-5 sm:p-6 bg-surface-2/30">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-foreground">
                          Recommended CLAUDE.md
                        </h3>
                        <CopyButton text={structure.claudeMdTips} />
                      </div>
                      <pre className="text-xs text-foreground/90 font-mono bg-surface p-4 rounded-lg overflow-x-auto leading-relaxed border border-border">
                        <code>{structure.claudeMdTips}</code>
                      </pre>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer note */}
      <section className="border-t border-border py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="text-sm text-muted">
            Want to contribute a structure? Open a PR on{" "}
            <a
              href="https://github.com/Khader9Jber/klaude-academy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
