# Claude Academy -- Content Plan

Last updated: 2026-04-04

This document is the single source of truth for Claude Academy's content strategy. It covers what exists, what needs improvement, what to build next, and exactly how to add new content. Anyone contributing content should read this first.

---

## 1. Current Content Inventory

**Totals:** 13 modules, 74 lessons, 294 quiz questions, 4 arcs

### Arc 1: Foundation (Modules 1-4, green #5cb870)

#### Module 1 -- Claude Fundamentals
- **Directory:** `content/modules/01-claude-fundamentals/`
- **Arc:** Foundation | **Difficulty:** Beginner | **Est. Hours:** 2
- **Lessons:** 4 | **Quiz Questions:** 13
- **Prerequisites:** None

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-what-is-claude.mdx` | What Is Claude and Who Built It | 0 |
| 2 | `02-model-family.mdx` | The Claude Model Family | 4 |
| 3 | `03-tokens-and-context.mdx` | Tokens and Context Windows Explained | 5 |
| 4 | `04-plans-and-pricing.mdx` | Plans and Pricing | 4 |

**Notes:** Lesson 01 is the only lesson in the entire curriculum with zero quiz questions. Content is hand-crafted and informative but introductory. Solid Tier 1 content.

---

#### Module 2 -- Prompt Engineering
- **Directory:** `content/modules/02-prompt-engineering/`
- **Arc:** Foundation | **Difficulty:** Beginner | **Est. Hours:** 4
- **Lessons:** 8 (7 content lessons + 1 module quiz) | **Quiz Questions:** 38
- **Prerequisites:** Module 1

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-first-prompt.mdx` | Your First Prompt: From Vague to Precise | 4 |
| 2 | `02-anatomy-of-a-prompt.mdx` | The Anatomy of a Great Prompt | 4 |
| 3 | `03-zero-shot.mdx` | Zero-Shot Prompting | 3 |
| 4 | `04-few-shot.mdx` | Few-Shot Prompting | 4 |
| 5 | `05-chain-of-thought.mdx` | Chain of Thought Reasoning | 4 |
| 6 | `06-advanced-patterns.mdx` | Advanced Prompting Patterns | 4 |
| 7 | `07-prompt-templates.mdx` | Prompt Templates and Reusability | 3 |
| 8 | `08-quiz.mdx` | Prompt Engineering: Module Quiz | 12 |

**Notes:** The strongest module in the curriculum. Deep, specific content with realistic before/after examples. The module quiz (lesson 8) is a standalone 12-question comprehensive assessment. Tier 1.

---

#### Module 3 -- Claude Code Basics
- **Directory:** `content/modules/03-claude-code-basics/`
- **Arc:** Foundation | **Difficulty:** Beginner | **Est. Hours:** 3
- **Lessons:** 5 | **Quiz Questions:** 20
- **Prerequisites:** Module 1

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-installation.mdx` | Installing Claude Code | 4 |
| 2 | `02-interactive-repl.mdx` | The Interactive REPL | 4 |
| 3 | `03-essential-commands.mdx` | Essential Commands | 4 |
| 4 | `04-file-references.mdx` | File References with @ | 4 |
| 5 | `05-reading-writing-files.mdx` | Reading and Writing Files | 4 |

**Notes:** Practical, hands-on content. Good entry point for users transitioning from web Claude to Claude Code. Tier 1.

---

#### Module 4 -- Commands and Navigation
- **Directory:** `content/modules/04-commands-and-navigation/`
- **Arc:** Foundation | **Difficulty:** Beginner | **Est. Hours:** 2
- **Lessons:** 5 | **Quiz Questions:** 21
- **Prerequisites:** Module 3

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-slash-commands.mdx` | Slash Commands Reference | 4 |
| 2 | `02-session-management.mdx` | Session Management | 4 |
| 3 | `03-model-switching.mdx` | Model Switching | 4 |
| 4 | `04-keyboard-shortcuts.mdx` | Keyboard Shortcuts | 4 |
| 5 | `05-effort-levels.mdx` | Effort Levels | 5 |

**Notes:** Reference-style content. Useful as a cheat sheet. Tier 2 -- could benefit from more workflow-oriented examples showing when to use each command.

---

### Arc 2: Practitioner (Modules 5-8, blue #5e9ed6)

#### Module 5 -- CLAUDE.md and Configuration
- **Directory:** `content/modules/05-claude-md-and-config/`
- **Arc:** Practitioner | **Difficulty:** Intermediate | **Est. Hours:** 3
- **Lessons:** 6 | **Quiz Questions:** 24
- **Prerequisites:** Module 4

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-claude-md-basics.mdx` | CLAUDE.md Basics: Your Project's Brain | 4 |
| 2 | `02-claude-md-mastery.mdx` | CLAUDE.md Mastery | 4 |
| 3 | `03-hierarchy.mdx` | The Configuration Hierarchy | 4 |
| 4 | `04-configuration-layers.mdx` | Configuration Layers | 4 |
| 5 | `05-permissions.mdx` | Permissions System | 4 |
| 6 | `06-production-safe.mdx` | Production-Safe Configuration | 4 |

**Notes:** Excellent content. CLAUDE.md basics lesson is one of the best in the curriculum -- complete with realistic templates, testing instructions, and clear explanations. Tier 1.

---

#### Module 6 -- Session and Context Management
- **Directory:** `content/modules/06-session-and-context/`
- **Arc:** Practitioner | **Difficulty:** Intermediate | **Est. Hours:** 3
- **Lessons:** 5 | **Quiz Questions:** 20
- **Prerequisites:** Module 5

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-context-window.mdx` | The Context Window Deep Dive | 4 |
| 2 | `02-context-strategies.mdx` | Context Strategies | 4 |
| 3 | `03-session-features.mdx` | Session Features | 4 |
| 4 | `04-environment-variables.mdx` | Environment Variables | 4 |
| 5 | `05-auto-memory.mdx` | Auto-Memory and Persistence | 4 |

**Notes:** Solid conceptual content. Tier 2 -- context strategies could use more concrete "before and after" token budgets.

---

#### Module 7 -- Git and Development Workflows
- **Directory:** `content/modules/07-git-and-workflows/`
- **Arc:** Practitioner | **Difficulty:** Intermediate | **Est. Hours:** 4
- **Lessons:** 6 | **Quiz Questions:** 23
- **Prerequisites:** Module 6

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-git-workflows.mdx` | Git Workflows with Claude | 4 |
| 2 | `02-writing-beyond-code.mdx` | Writing Beyond Code | 3 |
| 3 | `03-custom-commands.mdx` | Custom Slash Commands | 4 |
| 4 | `04-advanced-commands.mdx` | Advanced Custom Commands | 4 |
| 5 | `05-headless-mode.mdx` | Headless Mode (claude -p) | 4 |
| 6 | `06-pipe-processing.mdx` | Pipe Processing | 4 |

**Notes:** Good practical content. Headless mode and pipe processing are strong lessons. Tier 2 -- git workflows lesson could use more complex real-world branching scenarios.

---

#### Module 8 -- MCP Fundamentals
- **Directory:** `content/modules/08-mcp-fundamentals/`
- **Arc:** Practitioner | **Difficulty:** Intermediate | **Est. Hours:** 3
- **Lessons:** 5 | **Quiz Questions:** 20
- **Prerequisites:** Module 3

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-mcp-explained.mdx` | MCP: The Protocol That Changes Everything | 4 |
| 2 | `02-first-mcp-server.mdx` | Your First MCP Server | 4 |
| 3 | `03-mcp-databases.mdx` | MCP for Databases | 4 |
| 4 | `04-transport-types.mdx` | Transport Types | 4 |
| 5 | `05-building-integrations.mdx` | Building MCP Integrations | 4 |

**Notes:** Strong introductory MCP content with good architecture diagrams (ASCII art). The token cost section in lesson 1 is uniquely valuable. Tier 1.

---

### Arc 3: Power User (Modules 9-11, purple #a07ed6)

#### Module 9 -- Hooks and Automation
- **Directory:** `content/modules/09-hooks-and-automation/`
- **Arc:** Power User | **Difficulty:** Advanced | **Est. Hours:** 3
- **Lessons:** 5 | **Quiz Questions:** 20
- **Prerequisites:** Modules 5, 8

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-hook-events.mdx` | All 11 Hook Events Explained | 4 |
| 2 | `02-auto-format.mdx` | Auto-Format on Save | 4 |
| 3 | `03-notification-hooks.mdx` | Notification Hooks | 4 |
| 4 | `04-cicd-integration.mdx` | CI/CD Integration | 4 |
| 5 | `05-advanced-hooks.mdx` | Advanced Hook Patterns | 4 |

**Notes:** Hook events lesson (01) is comprehensive with all 11 events, matchers, and variables. Tier 2 -- later lessons in this module could use more end-to-end automation pipeline examples.

---

#### Module 10 -- Agents and Skills
- **Directory:** `content/modules/10-agents-and-skills/`
- **Arc:** Power User | **Difficulty:** Advanced | **Est. Hours:** 5
- **Lessons:** 7 | **Quiz Questions:** 27
- **Prerequisites:** Module 9

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-sub-agents.mdx` | Sub-Agents: Parallel Workers | 4 |
| 2 | `02-agent-frontmatter.mdx` | Agent Frontmatter and Configuration | 4 |
| 3 | `03-skills.mdx` | Skills: Reusable Knowledge Packages | 4 |
| 4 | `04-pr-review-skill.mdx` | Building a PR Review Skill | 3 |
| 5 | `05-agent-teams.mdx` | Agent Teams | 4 |
| 6 | `06-plan-mode-debugging.mdx` | Plan Mode and Debugging | 4 |
| 7 | `07-git-worktrees.mdx` | Git Worktrees for Agent Isolation | 4 |

**Notes:** Largest Power User module. Good coverage of agent patterns. Skills lesson is clear with progressive disclosure explanation. Tier 2 -- could use more complete, copy-pasteable skill and agent templates.

---

#### Module 11 -- Advanced Workflows
- **Directory:** `content/modules/11-advanced-workflows/`
- **Arc:** Power User | **Difficulty:** Advanced | **Est. Hours:** 5
- **Lessons:** 7 | **Quiz Questions:** 25
- **Prerequisites:** Modules 10, 7

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-batch.mdx` | /batch: Codebase-Wide Migrations | 4 |
| 2 | `02-simplify.mdx` | /simplify: Code Quality Reviews | 3 |
| 3 | `03-loop.mdx` | /loop: Recurring Automation | 3 |
| 4 | `04-remote-control.mdx` | Remote Control and Channels | 3 |
| 5 | `05-channels.mdx` | Claude Channels | 4 |
| 6 | `06-token-optimization.mdx` | Token Optimization Strategies | 4 |
| 7 | `07-ide-github-connectors.mdx` | IDE and GitHub Connectors | 4 |

**Notes:** Good coverage of advanced CLI features. The batch lesson has realistic migration scenarios. Tier 2 -- simplify, loop, and remote-control lessons have only 3 quiz questions each (below the 4-question standard).

---

### Arc 4: Expert (Modules 12-13, gold #d4a053)

#### Module 12 -- Enterprise and Production
- **Directory:** `content/modules/12-enterprise-and-production/`
- **Arc:** Expert | **Difficulty:** Expert | **Est. Hours:** 5
- **Lessons:** 7 | **Quiz Questions:** 27
- **Prerequisites:** Module 11

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-custom-mcp-servers.mdx` | Building Custom MCP Servers | 4 |
| 2 | `02-mcp-auth-security.mdx` | MCP Auth and Security | 4 |
| 3 | `03-mcp-elicitation.mdx` | MCP Elicitation | 3 |
| 4 | `04-claude-code-sdk.mdx` | The Claude Code SDK | 4 |
| 5 | `05-headless-at-scale.mdx` | Headless at Scale | 4 |
| 6 | `06-enterprise-patterns.mdx` | Enterprise Patterns | 4 |
| 7 | `07-monitoring.mdx` | Monitoring and Observability | 4 |

**Notes:** Custom MCP servers lesson is excellent -- complete TypeScript implementation from scratch. Tier 1 for lessons 1-2 and 4. Tier 2 for the rest -- enterprise patterns and monitoring could use more real org-level case studies.

---

#### Module 13 -- Capstone
- **Directory:** `content/modules/13-capstone/`
- **Arc:** Expert | **Difficulty:** Expert | **Est. Hours:** 8
- **Lessons:** 4 | **Quiz Questions:** 16
- **Prerequisites:** Module 12

| # | File | Title | Quizzes |
|---|------|-------|---------|
| 1 | `01-agentic-systems.mdx` | Designing Agentic Systems | 4 |
| 2 | `02-production-case-study.mdx` | Production Case Study | 4 |
| 3 | `03-cloud-automation.mdx` | Cloud Automation with Claude | 4 |
| 4 | `04-graduation.mdx` | Your Claude Mastery Graduation | 4 |

**Notes:** Agentic systems lesson has excellent architecture diagrams (specialist pool, supervisor+workers, pipeline, mapper+reducer). Graduation lesson ties everything together. Tier 1 for lesson 1, Tier 2 for the rest.

---

## 2. Content Architecture

### Directory Structure

```
content/
  modules/
    XX-slug/                    # Module directory (XX = 01-99, slug = kebab-case)
      _module.json              # Module metadata (required)
      NN-slug.mdx               # Lesson file (NN = 01-99, slug = kebab-case)
```

- Modules are ordered by the `XX` prefix in the directory name.
- Lessons within a module are ordered by the `NN` prefix in the filename.
- The `_module.json` file is required for every module.

### MDX Frontmatter Schema

Every lesson MDX file starts with YAML frontmatter:

```yaml
---
title: "Lesson Title Here"              # Required. Human-readable title.
slug: "lesson-slug-here"                # Required. URL slug (kebab-case). Must be unique within the module.
order: 1                                # Required. Display order within the module (matches NN prefix).
difficulty: "beginner"                  # Required. One of: "beginner", "intermediate", "advanced", "expert"
duration: 15                            # Required. Estimated reading time in minutes.
tags: ["tag1", "tag2"]                  # Required. Array of lowercase tags for search/filtering.
objectives:                             # Required. Array of learning objectives (2-4 items).
  - "First learning objective"
  - "Second learning objective"
quiz:                                   # Optional but strongly recommended. Array of quiz questions.
  - id: "unique-quiz-id"               #   Required. Unique identifier (module-prefix + number).
    question: "The question text?"      #   Required. The question.
    type: "multiple-choice"             #   Required. Currently only "multiple-choice" is supported.
    options:                            #   Required. Array of 4 answer options.
      - "Option A"
      - "Option B"
      - "Option C"
      - "Option D"
    correct: 1                          #   Required. Zero-indexed correct answer (0-3).
    explanation: "Why this is correct"  #   Required. Explanation shown after answering.
---
```

### Quiz Question Format

- Each lesson should have **3-5 quiz questions** (standard is 4).
- Questions use zero-indexed `correct` field (0 = first option, 3 = last option).
- The `id` field must be globally unique. Convention: `module-prefix-number` (e.g., `hooks-1`, `batch-2`).
- Explanations should teach, not just confirm -- explain WHY the answer is correct.
- Module quiz lessons (like `02-prompt-engineering/08-quiz.mdx`) can have 10-12 questions for comprehensive assessment.

### Module Metadata Format (_module.json)

```json
{
  "title": "Module Title",             // Required. Human-readable name.
  "slug": "module-slug",               // Required. Must match MODULE_ORDER entry in constants.ts.
  "description": "What this module covers in 1-2 sentences.",  // Required.
  "arc": "foundation",                 // Required. One of: "foundation", "practitioner", "power-user", "expert"
  "order": 1,                          // Required. Global display order (1-99).
  "icon": "brain",                     // Required. Lucide icon name.
  "color": "#5cb870",                  // Required. Hex color matching the arc.
  "estimatedHours": 2,                 // Required. Total estimated hours for all lessons.
  "prerequisites": [],                 // Required. Array of prerequisite module slugs (can be empty).
  "lessonCount": 4                     // Required. Number of MDX lesson files in this module.
}
```

**Arc colors:**
- Foundation: `#5cb870` (green)
- Practitioner: `#5e9ed6` (blue)
- Power User: `#a07ed6` (purple)
- Expert: `#d4a053` (gold)

### How Modules Map to Arcs

The mapping is defined in two places:

1. **`_module.json`:** Each module's `arc` field declares which arc it belongs to.
2. **`src/lib/constants.ts`:** `ARC_DEFINITIONS` defines the arcs and their display properties. Each arc has an `id`, `name`, `color`, `description`, and `range` (human-readable module range).

Current mapping:
- Foundation: Modules 1-4 (claude-fundamentals, prompt-engineering, claude-code-basics, commands-and-navigation)
- Practitioner: Modules 5-8 (claude-md-and-config, session-and-context, git-and-workflows, mcp-fundamentals)
- Power User: Modules 9-11 (hooks-and-automation, agents-and-skills, advanced-workflows)
- Expert: Modules 12-13 (enterprise-and-production, capstone)

### How MODULE_ORDER Controls Display

`src/lib/constants.ts` exports a `MODULE_ORDER` array of module slugs:

```typescript
export const MODULE_ORDER: string[] = [
  "claude-fundamentals",
  "prompt-engineering",
  "claude-code-basics",
  "commands-and-navigation",
  "claude-md-and-config",
  "session-and-context",
  "git-and-workflows",
  "mcp-fundamentals",
  "hooks-and-automation",
  "agents-and-skills",
  "advanced-workflows",
  "enterprise-and-production",
  "capstone",
];
```

This array determines the order modules appear on the curriculum page. The content loader (`src/lib/content.ts`) uses this array to sort modules. **If a module's slug is not in this array, it will not appear on the site.**

---

## 3. Content Style Guide

### Writing Tone and Voice

- **Direct and practical.** Write as a senior engineer teaching a capable colleague, not as a textbook.
- **Second person ("you").** "When you start a new session..." not "When a user starts..."
- **Confident assertions.** "This is the single most impactful thing you can add" not "This might be helpful."
- **Opinionated when warranted.** Give clear recommendations rather than listing every option.
- **Real frustrations acknowledged.** "Here's a truth that trips up every new Claude user..." builds trust.

### Lesson Structure

Every lesson follows this structure:

1. **Frontmatter** -- title, slug, order, difficulty, duration, tags, objectives, quiz
2. **Opening hook** -- 2-3 paragraphs that establish WHY this topic matters. Lead with a problem the reader has experienced.
3. **Core content** -- Teach the concept with:
   - Clear explanations
   - Code examples (realistic, not toy examples)
   - Before/after comparisons when applicable
   - ASCII diagrams for architecture concepts
   - Tables for reference information
4. **Practical application** -- Show how to use what was taught in a real workflow.
5. **Key Takeaway** -- A single paragraph (4-6 sentences) that summarizes the lesson's core message. Always the final section. Always uses the h2 heading `## Key Takeaway`.

### Code Example Standards

- Always include a language annotation on fenced code blocks: ````typescript`, ````bash`, ````json`, ````yaml`, ````markdown`
- Use realistic examples from plausible projects, not `foo`/`bar`/`baz`.
- Keep code blocks focused. Show the relevant part, not an entire file.
- Use comments in code to explain non-obvious lines.
- For CLI examples, show both the command and representative output where helpful.
- For configuration examples (JSON, YAML), show complete, copy-pasteable snippets.

### Quiz Question Standards

- **3-5 questions per lesson** (4 is the standard, 3 is the minimum).
- **4 options per question** (multiple-choice only).
- **Explanation is mandatory** for every question -- explanations should teach.
- One clearly correct answer. Distractors should be plausible but clearly wrong upon reflection.
- Questions should test understanding, not memorization of trivia.
- At least one question per lesson should test application (not just recall).

### Heading Hierarchy

- **h2 (`##`)** for major sections within the lesson body. The lesson title comes from frontmatter, not an h1 in the content.
- **h3 (`###`)** for subsections within a major section.
- **h4 (`####`)** sparingly, for items within a subsection (e.g., individual hook events).
- Never use h1 (`#`) in lesson content -- it is reserved for the rendered lesson title.

### Length Targets

- **Minimum:** 800 words per lesson
- **Target:** 1200-1500 words per lesson
- **Maximum:** 2000 words per lesson (split into two lessons if longer)
- **Module quiz lessons** are an exception -- can be shorter (500-800 words) since the quiz itself is the content.

### Formatting Conventions

- **Bold** for key terms on first mention (e.g., **Constitutional AI (CAI)**, **Model Context Protocol (MCP)**).
- **Italics** for emphasis on single words or short phrases.
- **Inline code** for file paths, command names, function names, config keys, and short code references.
- Use tables for reference material (command lists, comparison charts, event catalogs).
- Use blockquotes sparingly -- prefer Callout components for tips/warnings.

### Technical Accuracy Requirements

- All content must be accurate for Claude Code v2.1+ (current stable).
- When Claude Code features change in a new release, affected lessons must be updated.
- Code examples must work as written -- no pseudocode in code blocks (pseudocode goes in plain text).
- If a feature is experimental or in beta, mark it clearly.

---

## 4. Content Quality Tiers

### Tier 1 -- Production-Ready

Deep, specific, hand-crafted content with realistic examples. These lessons are the gold standard.

| Module | Lessons | Why Tier 1 |
|--------|---------|-----------|
| 01 -- Claude Fundamentals | All 4 | Clear explanations of foundational concepts, accessible to beginners |
| 02 -- Prompt Engineering | All 8 | The strongest module. Detailed before/after examples, 12-question module quiz, realistic code scenarios |
| 03 -- Claude Code Basics | All 5 | Practical, step-by-step hands-on content |
| 05 -- CLAUDE.md and Config | All 6 | Excellent templates, complete with testing instructions, production patterns |
| 08 -- MCP Fundamentals | All 5 | Strong architecture diagrams, unique token cost analysis, clear client-server explanation |
| 12 -- Enterprise (lessons 1-2, 4) | 3 of 7 | Custom MCP server lesson has a complete TypeScript implementation |
| 13 -- Capstone (lesson 1) | 1 of 4 | Agentic systems has excellent architecture pattern diagrams |

### Tier 2 -- Good

Solid structure and content, but could benefit from more specific examples, richer scenarios, or additional quiz questions.

| Module | Lessons | What to Improve |
|--------|---------|----------------|
| 04 -- Commands and Navigation | All 5 | Add more workflow-oriented examples; currently reference-heavy |
| 06 -- Session and Context | All 5 | Add concrete token budget calculations and before/after compaction examples |
| 07 -- Git and Workflows | All 6 | Git workflows lesson needs more complex branching scenarios |
| 09 -- Hooks and Automation | All 5 | Add end-to-end automation pipeline examples beyond individual hooks |
| 10 -- Agents and Skills | All 7 | Add complete, copy-pasteable skill and agent templates |
| 11 -- Advanced Workflows | All 7 | Lessons 2-4 have only 3 quiz questions each (below standard of 4) |
| 12 -- Enterprise (lessons 3, 5-7) | 4 of 7 | Enterprise patterns and monitoring need real org-level case studies |
| 13 -- Capstone (lessons 2-4) | 3 of 4 | Could use more guided project walkthroughs |

### Tier 3 -- Needs Enrichment

No module falls entirely into Tier 3. However, the REFRESHER.md notes that "lessons 50-100 have more templated content than lessons 1-20." The later lessons in modules 9-13 trend toward Tier 2 and would benefit most from enrichment passes focused on specific examples and code depth.

---

## 5. Content Improvement Roadmap

### Lessons Needing More Specific Code Examples

These lessons have the structure and concepts but need richer, more detailed code:

| Module | Lesson | What to Add |
|--------|--------|------------|
| 06 | `02-context-strategies.mdx` | Real token budget calculation with a 50-message session example |
| 06 | `05-auto-memory.mdx` | Show what auto-memory actually writes and how to edit it |
| 07 | `01-git-workflows.mdx` | Complex branching scenario: feature branch, review, rebase, merge |
| 09 | `04-cicd-integration.mdx` | Complete GitHub Actions workflow using Claude Code hooks |
| 10 | `04-pr-review-skill.mdx` | Full, copy-pasteable SKILL.md for a PR review skill |
| 10 | `05-agent-teams.mdx` | End-to-end team configuration with 3 agents working together |
| 12 | `06-enterprise-patterns.mdx` | Real organizational rollout playbook with phases and metrics |
| 12 | `07-monitoring.mdx` | Complete monitoring stack config (logs, metrics, alerts) |

### Lessons Needing Better Real-World Scenarios

| Module | Lesson | What to Add |
|--------|--------|------------|
| 04 | `01-slash-commands.mdx` | Workflow scenarios: "You're debugging a crash and need to..." |
| 06 | `04-environment-variables.mdx` | Multi-environment setup (dev, staging, prod) example |
| 09 | `05-advanced-hooks.mdx` | Complete "safety gate" pipeline: format -> lint -> test -> notify |
| 11 | `04-remote-control.mdx` | Remote pair programming scenario between two developers |
| 13 | `03-cloud-automation.mdx` | AWS/GCP infrastructure automation with actual service names |

### Quizzes Needing Additional Questions

These lessons have only 3 quiz questions (below the 4-question standard):

| Module | Lesson | Current | Target |
|--------|--------|---------|--------|
| 02 | `03-zero-shot.mdx` | 3 | 4 |
| 02 | `07-prompt-templates.mdx` | 3 | 4 |
| 07 | `02-writing-beyond-code.mdx` | 3 | 4 |
| 10 | `04-pr-review-skill.mdx` | 3 | 4 |
| 11 | `02-simplify.mdx` | 3 | 4 |
| 11 | `03-loop.mdx` | 3 | 4 |
| 11 | `04-remote-control.mdx` | 3 | 4 |
| 12 | `03-mcp-elicitation.mdx` | 3 | 4 |

One lesson has 0 quiz questions:

| Module | Lesson | Current | Target |
|--------|--------|---------|--------|
| 01 | `01-what-is-claude.mdx` | 0 | 4 |

**Fixing all of the above would add 13 new quiz questions, bringing the total from 294 to 307.**

### Modules Needing Additional Lessons

| Module | Current Lessons | Proposed Addition |
|--------|----------------|------------------|
| 01 | 4 | Add lesson on Claude's capabilities and limitations |
| 03 | 5 | Add troubleshooting common issues lesson |
| 04 | 5 | Add a "daily workflow" lesson combining all commands |
| 13 | 4 | Add a guided project walkthrough lesson |

---

## 6. Future Content Roadmap

### 6.1 New Lessons for Existing Modules

#### Module 1 -- Claude Fundamentals
- `05-capabilities-and-limits.mdx` -- What Claude can and cannot do: code generation strengths, hallucination patterns, knowledge cutoff, and how to verify output
- `06-claude-vs-alternatives.mdx` -- Honest comparison with GPT-4, Gemini, and open-source models: where Claude excels, where others are better

#### Module 2 -- Prompt Engineering
- `09-prompt-debugging.mdx` -- When Prompts Don't Work: systematic debugging (identify the gap, test hypotheses, isolate variables)
- `10-domain-specific-prompting.mdx` -- Domain-Specific Prompting: tailoring prompts for legal, medical, financial, and academic contexts

#### Module 3 -- Claude Code Basics
- `06-troubleshooting.mdx` -- Troubleshooting Common Issues: installation failures, permission errors, auth problems, slow responses, and the fix for each

#### Module 4 -- Commands and Navigation
- `06-daily-workflow.mdx` -- A Day in the Life: end-to-end workflow combining commands, navigation, and session management for a realistic development day

#### Module 5 -- CLAUDE.md and Configuration
- `07-claude-md-templates.mdx` -- CLAUDE.md Templates Gallery: pre-built templates for React, FastAPI, Django, Go, Rust, and monorepo projects
- `08-team-config-patterns.mdx` -- Team Configuration: shared settings.json patterns for teams of 2, 5, and 20+ developers

#### Module 6 -- Session and Context
- `06-multi-file-strategies.mdx` -- Working Across Large Codebases: strategies for projects with 100+ files when you can't fit everything in context
- `07-token-budget-calculator.mdx` -- Token Budget Calculator: interactive lesson showing exactly how tokens are consumed in different scenarios

#### Module 7 -- Git and Workflows
- `07-code-review-workflow.mdx` -- Automated Code Review Pipeline: Claude reads the diff, reviews against CLAUDE.md rules, posts comments
- `08-monorepo-workflows.mdx` -- Monorepo Workflows: working with Claude in Turborepo, Nx, and pnpm workspace projects

#### Module 8 -- MCP Fundamentals
- `06-mcp-server-gallery.mdx` -- MCP Server Gallery: curated list of the 20 most useful MCP servers with setup instructions and use cases for each
- `07-mcp-troubleshooting.mdx` -- MCP Troubleshooting: diagnosing connection failures, tool timeouts, auth errors, and token budget overruns

#### Module 9 -- Hooks and Automation
- `06-automation-pipelines.mdx` -- Building Automation Pipelines: chaining hooks together for format -> lint -> test -> notify workflows
- `07-team-hook-library.mdx` -- Team Hook Library: 10 production-ready hooks your team can adopt today

#### Module 10 -- Agents and Skills
- `08-skill-gallery.mdx` -- Skill Gallery: 10 production-ready skills (migration, refactor, documentation, i18n, accessibility, testing, security, API design, database, performance)
- `09-custom-agent-recipes.mdx` -- Custom Agent Recipes: step-by-step recipes for building a security reviewer, test writer, and documentation generator

#### Module 11 -- Advanced Workflows
- `08-large-codebase-refactor.mdx` -- Large Codebase Refactoring: real-world strategy for refactoring a 50K+ LOC codebase with Claude
- `09-documentation-generation.mdx` -- Documentation Generation at Scale: using /batch to generate docs for an entire API

#### Module 12 -- Enterprise and Production
- `08-compliance-frameworks.mdx` -- Compliance Frameworks: SOC 2, HIPAA, and GDPR considerations when using Claude in enterprise environments
- `09-cost-management.mdx` -- Cost Management: tracking token usage, setting budgets, optimizing spend across teams

#### Module 13 -- Capstone
- `05-guided-project.mdx` -- Guided Capstone Project: step-by-step walkthrough of building a full-stack app entirely with Claude Code, from CLAUDE.md to deployment

**Total: 26 new lessons across 13 modules, bringing the curriculum from 74 to 100 lessons.**

---

### 6.2 New Modules for Existing Arcs

#### Module 14 -- Real-World Projects (Practitioner Arc)

- **Slug:** `real-world-projects`
- **Arc:** practitioner
- **Description:** Guided end-to-end projects using Claude Code. Each lesson is a complete project from setup to deployment.
- **Estimated Hours:** 6
- **Prerequisites:** `mcp-fundamentals`
- **Lessons:**
  1. `01-rest-api-from-scratch.mdx` -- Build a REST API from scratch with Claude Code
  2. `02-react-dashboard.mdx` -- Build an admin dashboard with React and Claude
  3. `03-cli-tool.mdx` -- Build a CLI tool with Claude Code
  4. `04-database-migration.mdx` -- Migrate a database schema with zero downtime using Claude
  5. `05-testing-suite.mdx` -- Generate a complete test suite for an existing project
  6. `06-documentation-overhaul.mdx` -- Rewrite an entire project's documentation with Claude

#### Module 15 -- Claude for Teams (Power User Arc)

- **Slug:** `claude-for-teams`
- **Arc:** power-user
- **Description:** Team workflows, shared configurations, onboarding patterns, and collaborative Claude Code usage.
- **Estimated Hours:** 4
- **Prerequisites:** `agents-and-skills`
- **Lessons:**
  1. `01-team-onboarding.mdx` -- Onboarding New Team Members with Claude Code
  2. `02-shared-configurations.mdx` -- Shared CLAUDE.md, settings.json, and Command Libraries
  3. `03-code-review-standards.mdx` -- Standardized Claude-Assisted Code Reviews
  4. `04-pair-programming-patterns.mdx` -- Pair Programming Patterns with Claude
  5. `05-team-metrics.mdx` -- Measuring Team Productivity with Claude Code

#### Module 16 -- Claude API and SDK (Expert Arc)

- **Slug:** `claude-api-sdk`
- **Arc:** expert
- **Description:** Building applications with the Anthropic API and Claude Agent SDK. From simple API calls to full agent applications.
- **Estimated Hours:** 6
- **Prerequisites:** `enterprise-and-production`
- **Lessons:**
  1. `01-api-fundamentals.mdx` -- Anthropic API: Authentication, Models, and Your First Request
  2. `02-streaming-responses.mdx` -- Streaming Responses and Server-Sent Events
  3. `03-tool-use.mdx` -- Tool Use: Giving Claude Functions to Call
  4. `04-agent-sdk-intro.mdx` -- Claude Agent SDK: Building Agent Applications
  5. `05-production-api-patterns.mdx` -- Production API Patterns: Rate Limiting, Retries, and Error Handling
  6. `06-full-stack-ai-app.mdx` -- Building a Full-Stack AI Application

**Adding these 3 modules would add 17 lessons, bringing the total to 117 (or 91 with just new lessons from 6.1).**

---

### 6.3 New Arc: Specialist Tracks

A fifth arc for domain-specific content. These are optional side-tracks that students can take after completing the Practitioner arc.

**Arc Definition:**
```typescript
{
  id: "specialist",
  name: "Specialist Tracks",
  color: "#e06c75",
  description: "Apply your Claude skills to specific domains. Each track is an independent deep-dive you can take in any order.",
  range: "Tracks A-E",
}
```

#### Track A -- Claude for Data Science (Module 17)

- **Slug:** `claude-data-science`
- **Prerequisites:** `mcp-fundamentals`
- **Lessons:**
  1. `01-data-exploration.mdx` -- Exploratory Data Analysis with Claude
  2. `02-data-cleaning.mdx` -- Data Cleaning and Transformation
  3. `03-visualization.mdx` -- Building Visualizations with Claude's Help
  4. `04-ml-prototyping.mdx` -- ML Model Prototyping and Evaluation
  5. `05-jupyter-workflow.mdx` -- Claude Code in Jupyter Notebook Workflows

#### Track B -- Claude for Web Development (Module 18)

- **Slug:** `claude-web-dev`
- **Prerequisites:** `mcp-fundamentals`
- **Lessons:**
  1. `01-frontend-scaffolding.mdx` -- Scaffolding Frontend Projects (React, Vue, Svelte)
  2. `02-component-generation.mdx` -- Component Generation and Iteration
  3. `03-api-design.mdx` -- API Design and Implementation with Claude
  4. `04-css-and-styling.mdx` -- CSS, Tailwind, and Responsive Design with Claude
  5. `05-full-stack-workflow.mdx` -- Full-Stack Development Workflow

#### Track C -- Claude for DevOps and CI/CD (Module 19)

- **Slug:** `claude-devops`
- **Prerequisites:** `hooks-and-automation`
- **Lessons:**
  1. `01-infrastructure-as-code.mdx` -- Infrastructure as Code with Claude (Terraform, Pulumi)
  2. `02-cicd-pipelines.mdx` -- Building CI/CD Pipelines with Claude Code
  3. `03-container-workflows.mdx` -- Docker and Kubernetes Workflows
  4. `04-monitoring-setup.mdx` -- Setting Up Monitoring and Alerting
  5. `05-incident-response.mdx` -- Incident Response and Debugging with Claude

#### Track D -- Claude for Content Creators (Module 20)

- **Slug:** `claude-content`
- **Prerequisites:** `prompt-engineering`
- **Lessons:**
  1. `01-writing-workflows.mdx` -- Long-Form Writing Workflows (Blog Posts, Articles)
  2. `02-editing-and-revision.mdx` -- Editing and Revision with Claude
  3. `03-content-repurposing.mdx` -- Content Repurposing: One Piece, Many Formats
  4. `04-seo-and-metadata.mdx` -- SEO Optimization and Metadata Generation
  5. `05-content-calendar.mdx` -- Building and Maintaining a Content Calendar

#### Track E -- Claude for Security and Bug Bounty (Module 21)

- **Slug:** `claude-security`
- **Prerequisites:** `mcp-fundamentals`
- **Lessons:**
  1. `01-security-review.mdx` -- Automated Security Code Review with Claude
  2. `02-vuln-analysis.mdx` -- Vulnerability Analysis and Triage
  3. `03-pentest-assist.mdx` -- Penetration Testing Assistance
  4. `04-report-writing.mdx` -- Security Report Writing
  5. `05-bug-bounty-workflow.mdx` -- Bug Bounty Workflow with Claude Code

**Adding all 5 specialist tracks would add 25 lessons (5 modules x 5 lessons), bringing the grand total to 142 lessons across 21 modules and 5 arcs.**

---

## 7. How to Add New Content

### 7.1 Adding a New Lesson

**Step 1:** Decide which module it belongs to. Check the module list in Section 1 above.

**Step 2:** Determine the lesson number. Look at existing files in the module directory and pick the next number:
```bash
ls content/modules/XX-module-name/
# Example output: 01-first.mdx  02-second.mdx  03-third.mdx  _module.json
# Your new lesson would be: 04-your-slug.mdx
```

**Step 3:** Create the MDX file. Copy this complete template:

```mdx
---
title: "Your Lesson Title"
slug: "your-lesson-slug"
order: 4
difficulty: "intermediate"
duration: 15
tags: ["tag1", "tag2", "tag3"]
objectives:
  - "First learning objective"
  - "Second learning objective"
  - "Third learning objective"
quiz:
  - id: "prefix-1"
    question: "First quiz question?"
    type: "multiple-choice"
    options:
      - "Option A"
      - "Option B (correct)"
      - "Option C"
      - "Option D"
    correct: 1
    explanation: "Explanation of why B is correct and what the student should learn from this."
  - id: "prefix-2"
    question: "Second quiz question?"
    type: "multiple-choice"
    options:
      - "Option A"
      - "Option B"
      - "Option C (correct)"
      - "Option D"
    correct: 2
    explanation: "Explanation of why C is correct."
  - id: "prefix-3"
    question: "Third quiz question?"
    type: "multiple-choice"
    options:
      - "Option A (correct)"
      - "Option B"
      - "Option C"
      - "Option D"
    correct: 0
    explanation: "Explanation of why A is correct."
  - id: "prefix-4"
    question: "Fourth quiz question?"
    type: "multiple-choice"
    options:
      - "Option A"
      - "Option B"
      - "Option C"
      - "Option D (correct)"
    correct: 3
    explanation: "Explanation of why D is correct."
---

## Opening Hook

Start with 2-3 paragraphs that establish WHY this topic matters. Lead with a problem.

## Core Concept

Teach the main concept here. Use code examples:

```typescript
// Realistic code example
const result = await doSomething();
```

## Practical Application

Show how to use this in a real workflow.

## Key Takeaway

A single paragraph (4-6 sentences) that summarizes the lesson's core message.
```

**Step 4:** Write the content following the style guide (Section 3).

**Step 5:** Update `_module.json` -- increment the `lessonCount` field:
```json
{
  "lessonCount": 5  // was 4, now 5
}
```

**Step 6:** Verify the build:
```bash
npm run build
npm run lint
```

**Step 7:** Push to main. The CI/CD pipeline runs lint, typecheck, unit tests, and E2E tests, then auto-deploys to Netlify, GitHub Pages, and Vercel.

---

### 7.2 Adding a New Module

**Step 1:** Choose a module number and slug. Use the next available number:
```bash
ls content/modules/
# If the last module is 13-capstone, your new module is 14-your-module
```

**Step 2:** Create the module directory:
```bash
mkdir content/modules/14-your-module
```

**Step 3:** Create `_module.json`:
```json
{
  "title": "Your Module Title",
  "slug": "your-module",
  "description": "A 1-2 sentence description of what this module covers.",
  "arc": "practitioner",
  "order": 14,
  "icon": "brain",
  "color": "#5e9ed6",
  "estimatedHours": 3,
  "prerequisites": ["mcp-fundamentals"],
  "lessonCount": 5
}
```

**Step 4:** Add lessons as MDX files (see 7.1 above).

**Step 5:** Update `src/lib/constants.ts` -- add your module slug to the `MODULE_ORDER` array:
```typescript
export const MODULE_ORDER: string[] = [
  // ... existing modules ...
  "capstone",
  "your-module",  // Add here
];
```

**Important:** The position in `MODULE_ORDER` determines display order. Place new modules in the appropriate position relative to their arc.

**Step 6:** If the module is in a new position within an existing arc, update the `range` field in `ARC_DEFINITIONS` in `src/lib/constants.ts`.

**Step 7:** Verify and push:
```bash
npm run build
npm run lint
git push origin main
```

---

### 7.3 Adding a New Arc

**Step 1:** Add the arc definition to `src/lib/constants.ts`:
```typescript
export const ARC_DEFINITIONS: ArcDefinition[] = [
  // ... existing arcs ...
  {
    id: "specialist",
    name: "Specialist Tracks",
    color: "#e06c75",
    description: "Apply your Claude skills to specific domains.",
    range: "Modules 17-21",
  },
];
```

**Step 2:** Create modules for the new arc (see 7.2 above). Each module's `_module.json` should have `"arc": "specialist"`.

**Step 3:** Add all module slugs to `MODULE_ORDER` in the appropriate position.

**Step 4:** Update the curriculum page if it has any arc-specific rendering logic. Check `src/app/curriculum/` for hardcoded arc references.

**Step 5:** Choose an arc color that doesn't conflict with existing arcs:
- Foundation: `#5cb870` (green)
- Practitioner: `#5e9ed6` (blue)
- Power User: `#a07ed6` (purple)
- Expert: `#d4a053` (gold)
- Specialist: `#e06c75` (red/coral) -- suggested

**Step 6:** Build, test, push.

---

## 8. Content Calendar Template

Use this template to plan weekly/monthly content work. Priority levels: High (fills a critical gap), Medium (improves existing content), Low (nice-to-have expansion).

### Sample Calendar -- Q2 2026

| Week | Action | Module | Lesson/Target | Priority | Est. Hours |
|------|--------|--------|---------------|----------|------------|
| W1 | Add quizzes | 01 | `01-what-is-claude.mdx` (add 4 questions) | High | 0.5 |
| W1 | Add quizzes | 02, 07, 10-12 | Bring 8 lessons from 3 to 4 questions | High | 2 |
| W2 | New lesson | 02 | `09-prompt-debugging.mdx` | High | 3 |
| W2 | Enrich | 06 | `02-context-strategies.mdx` (add token budget examples) | Medium | 2 |
| W3 | New lesson | 03 | `06-troubleshooting.mdx` | High | 3 |
| W3 | Enrich | 07 | `01-git-workflows.mdx` (add complex branching scenario) | Medium | 2 |
| W4 | New lesson | 08 | `06-mcp-server-gallery.mdx` | Medium | 3 |
| W5 | Enrich | 09 | All lessons (add pipeline examples) | Medium | 4 |
| W5 | New lesson | 05 | `07-claude-md-templates.mdx` | Medium | 3 |
| W6 | New lesson | 10 | `08-skill-gallery.mdx` | Medium | 3 |
| W6 | Enrich | 12 | `06-enterprise-patterns.mdx` (add case studies) | Medium | 3 |
| W7 | New module | -- | 14-real-world-projects (lessons 1-3) | Medium | 8 |
| W8 | New module | -- | 14-real-world-projects (lessons 4-6) | Medium | 8 |
| W9 | New lesson | 12 | `08-compliance-frameworks.mdx` | Low | 3 |
| W10 | New lesson | 11 | `08-large-codebase-refactor.mdx` | Medium | 3 |
| W11 | New module | -- | 15-claude-for-teams (lessons 1-3) | Low | 8 |
| W12 | New module | -- | 15-claude-for-teams (lessons 4-5) | Low | 5 |

### Blank Calendar Template

```markdown
| Week | Action | Module | Lesson/Target | Priority | Est. Hours |
|------|--------|--------|---------------|----------|------------|
| W1   |        |        |               |          |            |
| W2   |        |        |               |          |            |
| W3   |        |        |               |          |            |
| W4   |        |        |               |          |            |
```

**Action types:** New lesson, Enrich (improve existing), Add quizzes, New module, Translate, Review

---

## 9. Content Review Checklist

Run through this checklist before publishing any new or updated lesson.

### Frontmatter
- [ ] `title` is set (human-readable, concise)
- [ ] `slug` is set (kebab-case, unique within module)
- [ ] `order` matches the file's NN prefix
- [ ] `difficulty` is one of: beginner, intermediate, advanced, expert
- [ ] `duration` is set (estimated reading time in minutes)
- [ ] `tags` array has 2-4 relevant tags (lowercase)
- [ ] `objectives` array has 2-4 learning objectives

### Quiz
- [ ] 3-5 quiz questions present (4 is the standard)
- [ ] Each question has a unique `id` (module-prefix-number)
- [ ] Each question has exactly 4 options
- [ ] `correct` field uses zero-indexed value (0-3)
- [ ] Every question has an `explanation` that teaches
- [ ] At least one question tests application (not just recall)

### Content
- [ ] Opens with a hook (2-3 paragraphs, problem-first)
- [ ] At least 2 code examples with language annotations
- [ ] Code examples are realistic (no foo/bar/baz)
- [ ] Key terms are **bolded** on first mention
- [ ] Ends with a `## Key Takeaway` section (4-6 sentences)
- [ ] 800-2000 words total
- [ ] No placeholder text, TODOs, or "coming soon" sections
- [ ] Headings use h2 for sections, h3 for subsections (no h1 in content)

### Technical Accuracy
- [ ] All information is accurate for Claude Code v2.1+
- [ ] Code examples work as written (no pseudocode in code blocks)
- [ ] CLI commands show correct syntax
- [ ] File paths reference the correct locations
- [ ] No deprecated features presented as current

### Module Metadata
- [ ] `_module.json` `lessonCount` matches actual number of MDX files
- [ ] Module slug is in `MODULE_ORDER` in `src/lib/constants.ts`

### Build Verification
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes (no regressions)
- [ ] `data-testid` added to any new interactive elements
- [ ] Site renders correctly at `http://localhost:3000`

---

## 10. Arabic Content Roadmap

### Vision

Translate Claude Academy into Arabic to serve Arabic-speaking developers. This requires both content translation and significant technical work for RTL (right-to-left) layout support.

### Phase 1: Foundation (Weeks 1-4) -- Module 1 Only

**Goal:** Translate Module 1 (Claude Fundamentals, 4 lessons) and validate the RTL infrastructure.

**Technical requirements:**
- Install and configure `next-intl` for internationalization
- Add Arabic locale files and routing (`/ar/` prefix)
- Implement RTL CSS support:
  - `dir="rtl"` on the HTML element for Arabic pages
  - Logical CSS properties (`margin-inline-start` instead of `margin-left`)
  - RTL-aware Tailwind classes (`rtl:` modifier)
- Add Arabic web fonts: Cairo (for headings) and Tajawal (for body text)
- Add a language switcher component in the navigation
- Test RTL rendering for all components: lesson content, quiz cards, progress indicators, navigation

**Content work:**
- Translate all 4 lessons in Module 1
- Translate the module's `_module.json` metadata
- Review translations with a native Arabic technical writer
- Test quiz questions in Arabic (ensure answer options render correctly in RTL)

**File structure:**
```
content/
  modules/
    01-claude-fundamentals/
      _module.json              # English (default)
      _module.ar.json           # Arabic metadata
      01-what-is-claude.mdx     # English
      01-what-is-claude.ar.mdx  # Arabic
```

### Phase 2: Rest of Foundation (Weeks 5-10)

**Goal:** Translate Modules 2-4 (Prompt Engineering, Claude Code Basics, Commands and Navigation).

- 19 additional lessons to translate
- Prompt Engineering module requires careful translation -- code examples stay in English, but explanations and quiz questions must be in natural Arabic
- Commands and Navigation requires RTL-aware keyboard shortcut displays

### Phase 3: Practitioner Arc (Weeks 11-18)

**Goal:** Translate Modules 5-8 (CLAUDE.md and Config, Session and Context, Git and Workflows, MCP Fundamentals).

- 22 additional lessons
- Configuration examples (JSON, YAML) stay in English -- only descriptions and explanations are translated
- MCP architecture diagrams need RTL-compatible ASCII art or SVG alternatives

### Phase 4: Remaining Modules (Weeks 19-28)

**Goal:** Translate Modules 9-13 (Power User and Expert arcs).

- 30 additional lessons
- Enterprise content may need localization beyond translation (region-specific compliance info)
- Capstone project descriptions should reference tools available in the MENA region

### Technical Checklist for Arabic Support

- [ ] `next-intl` installed and configured
- [ ] Arabic locale routing (`/ar/` prefix)
- [ ] RTL CSS with logical properties
- [ ] Cairo and Tajawal fonts loaded
- [ ] Language switcher component
- [ ] RTL-aware navigation and sidebar
- [ ] RTL-aware quiz components
- [ ] RTL-aware progress indicators
- [ ] RTL-aware code blocks (code stays LTR, labels/titles in RTL)
- [ ] Translated UI strings (buttons, labels, navigation)
- [ ] Arabic SEO metadata (title, description, OG tags)
- [ ] Arabic 404 and error pages

---

## Appendix: Quick Reference

### Current Stats (as of 2026-04-04)

| Metric | Count |
|--------|-------|
| Arcs | 4 |
| Modules | 13 |
| Lessons | 74 |
| Quiz questions | 294 |
| Lessons with 0 quizzes | 1 (`01-what-is-claude.mdx`) |
| Lessons with 3 quizzes (below standard) | 8 |
| Lessons with 4+ quizzes (at standard) | 65 |
| Tier 1 modules | 6 (fully or partially) |
| Tier 2 modules | 7 (partially or fully) |

### Module Quick Reference

| # | Module | Arc | Lessons | Quizzes | Tier |
|---|--------|-----|---------|---------|------|
| 01 | Claude Fundamentals | Foundation | 4 | 13 | 1 |
| 02 | Prompt Engineering | Foundation | 8 | 38 | 1 |
| 03 | Claude Code Basics | Foundation | 5 | 20 | 1 |
| 04 | Commands and Navigation | Foundation | 5 | 21 | 2 |
| 05 | CLAUDE.md and Configuration | Practitioner | 6 | 24 | 1 |
| 06 | Session and Context | Practitioner | 5 | 20 | 2 |
| 07 | Git and Workflows | Practitioner | 6 | 23 | 2 |
| 08 | MCP Fundamentals | Practitioner | 5 | 20 | 1 |
| 09 | Hooks and Automation | Power User | 5 | 20 | 2 |
| 10 | Agents and Skills | Power User | 7 | 27 | 2 |
| 11 | Advanced Workflows | Power User | 7 | 25 | 2 |
| 12 | Enterprise and Production | Expert | 7 | 27 | 1/2 |
| 13 | Capstone | Expert | 4 | 16 | 1/2 |
| **Total** | | | **74** | **294** | |
