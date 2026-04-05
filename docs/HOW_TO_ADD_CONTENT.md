# How to Add Content to Klaude Academy — A to Z

This guide covers everything you need to add lessons, modules, and arcs to the site.

---

## Adding a New Lesson

### Step 1: Pick the module

Your modules are in `content/modules/`. Each folder is numbered:
```
01-claude-fundamentals/
02-prompt-engineering/
03-claude-code-basics/
04-commands-and-navigation/
05-claude-md-and-config/
06-session-and-context/
07-git-and-workflows/
08-mcp-fundamentals/
09-hooks-and-automation/
10-agents-and-skills/
11-advanced-workflows/
12-enterprise-and-production/
13-capstone/
```

### Step 2: Check the next lesson number

```bash
ls content/modules/02-prompt-engineering/
# Shows: _module.json, 01-first-prompt.mdx, 02-anatomy-of-a-prompt.mdx, ...
# Next available number: 09
```

### Step 3: Create the MDX file

```bash
touch content/modules/02-prompt-engineering/09-prompt-debugging.mdx
```

Naming convention: `NN-slug.mdx` where NN is the order number (zero-padded) and slug is a URL-friendly name.

### Step 4: Add the frontmatter

Copy this template into your new file:

```yaml
---
title: "Your Lesson Title"
slug: "your-lesson-slug"
order: 9
difficulty: "intermediate"
duration: 15
tags: ["prompt-engineering", "debugging"]
objectives:
  - "First thing the learner will know"
  - "Second thing the learner will know"
  - "Third thing the learner will know"
quiz:
  - id: "q1-unique-id"
    question: "Your question here?"
    type: "multiple-choice"
    options:
      - "Option A"
      - "Option B"
      - "Option C"
      - "Option D"
    correct: 0
    explanation: "Why Option A is correct."
  - id: "q2-unique-id"
    question: "Second question?"
    type: "multiple-choice"
    options:
      - "Option A"
      - "Option B"
      - "Option C"
      - "Option D"
    correct: 2
    explanation: "Why Option C is correct."
  - id: "q3-unique-id"
    question: "Third question?"
    type: "multiple-choice"
    options:
      - "Option A"
      - "Option B"
    correct: 1
    explanation: "Why Option B is correct."
---
```

**Frontmatter field reference:**

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | Yes | string | Lesson display title |
| `slug` | Yes | string | URL slug (lowercase, hyphens) |
| `order` | Yes | number | Display order within module |
| `difficulty` | Yes | string | `beginner`, `intermediate`, `advanced`, or `expert` |
| `duration` | Yes | number | Estimated reading time in minutes |
| `tags` | Yes | string[] | Topic tags for search and filtering |
| `objectives` | Yes | string[] | 2-4 learning objectives |
| `quiz` | Yes | object[] | 3-5 quiz questions (see format below) |

**Quiz question format:**

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique ID (e.g., `q1-lesson-slug`) |
| `question` | Yes | string | The question text |
| `type` | Yes | string | `multiple-choice`, `multiple-select`, or `true-false` |
| `options` | Yes | string[] | Answer options (2-4 items) |
| `correct` | Yes | number | Index of correct answer (0-based) |
| `explanation` | Yes | string | Why the correct answer is correct |

### Step 5: Write the lesson content

Below the frontmatter `---`, write your lesson using this structure:

```markdown
# Your Lesson Title

Opening paragraph — hook the reader. Why does this matter? What will they learn?

## Section 1 Heading

Content here. Use **bold** for key terms on first mention.

```bash
# Real code examples with language annotations
claude -p "analyze this code for bugs"
```

## Section 2 Heading

More content. Include real-world examples, not generic placeholders.

```json
{
  "effortLevel": "high",
  "env": {
    "ENABLE_LSP_TOOL": "1"
  }
}
```

## Section 3 Heading

Continue building on previous sections. Each section should teach one concept.

## Key Takeaway

2-3 sentences summarizing the most important thing the reader learned in this lesson.
```

**Content rules:**
- 800-2000 words per lesson
- Use `##` for sections, `###` for subsections
- Bold key terms on first mention
- Include at least 2 code examples with language annotations
- Use real, working code — not pseudocode
- End with a "## Key Takeaway" section
- Tone: authoritative but conversational

### Step 6: Update the module metadata

Open `content/modules/02-prompt-engineering/_module.json` and increment `lessonCount`:

```json
{
  "title": "Prompt Engineering",
  "slug": "prompt-engineering",
  "lessonCount": 9
}
```

### Step 7: Verify locally

```bash
npm run dev          # Open http://localhost:3000, navigate to your lesson
npm run build        # Make sure static build passes
npm run lint         # No lint errors
npm test             # All unit tests pass
```

### Step 8: Commit and push

```bash
git add content/modules/02-prompt-engineering/09-prompt-debugging.mdx
git add content/modules/02-prompt-engineering/_module.json
git commit -m "content: add lesson on prompt debugging to Module 2"
git push
```

The CI/CD pipeline automatically:
1. Lints → type-checks → runs tests → runs E2E
2. Deploys to Netlify (https://klaude-academy.netlify.app)
3. Deploys to GitHub Pages (https://khader9jber.github.io/claude-academy/)

---

## Adding a New Module

### Step 1: Create the folder

```bash
mkdir content/modules/14-real-world-projects
```

Naming convention: `NN-slug/` where NN is the module number.

### Step 2: Create `_module.json`

```json
{
  "title": "Real-World Projects",
  "slug": "real-world-projects",
  "description": "Build complete projects using Claude Code from start to finish",
  "arc": "practitioner",
  "order": 14,
  "icon": "Hammer",
  "color": "#5e9ed6",
  "estimatedHours": 5,
  "prerequisites": ["claude-code-basics", "claude-md-and-config"],
  "lessonCount": 5
}
```

**Module metadata field reference:**

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | Yes | string | Module display title |
| `slug` | Yes | string | URL slug (must match folder name without number prefix) |
| `description` | Yes | string | What this module covers |
| `arc` | Yes | string | `foundation`, `practitioner`, `power-user`, or `expert` |
| `order` | Yes | number | Display order (1-based) |
| `icon` | Yes | string | Lucide icon name (e.g., `BookOpen`, `Code`, `Zap`) |
| `color` | Yes | string | Hex color for the module card |
| `estimatedHours` | Yes | number | Estimated completion time |
| `prerequisites` | Yes | string[] | Slugs of modules that should be completed first |
| `lessonCount` | Yes | number | Total number of lessons in this module |

**Arc colors:**
- Foundation: `#5cb870` (green)
- Practitioner: `#5e9ed6` (blue)
- Power User: `#a07ed6` (purple)
- Expert: `#d4a053` (gold)

### Step 3: Add lessons

Create MDX files following the lesson guide above:

```bash
touch content/modules/14-real-world-projects/01-build-a-cli-tool.mdx
touch content/modules/14-real-world-projects/02-build-an-api.mdx
touch content/modules/14-real-world-projects/03-build-a-bot.mdx
touch content/modules/14-real-world-projects/04-build-a-dashboard.mdx
touch content/modules/14-real-world-projects/05-module-quiz.mdx
```

### Step 4: Register the module

Open `src/lib/constants.ts` and add the slug to `MODULE_ORDER`:

```typescript
export const MODULE_ORDER = [
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
  "real-world-projects",  // ← add here
];
```

### Step 5: Verify and push

```bash
npm run build        # Verifies all new pages generate
npm run lint         # No errors
npm test             # All tests pass
git add -A
git commit -m "content: add Module 14 — Real-World Projects (5 lessons)"
git push
```

---

## Adding a New Arc

### Step 1: Define the arc

Open `src/lib/constants.ts` and add to `ARC_DEFINITIONS`:

```typescript
export const ARC_DEFINITIONS = [
  // ... existing 4 arcs ...
  {
    id: "specialist",
    name: "Specialist Tracks",
    color: "#5ec4c4",
    description: "Deep dives into specific domains with Claude",
    range: "Modules 17-21",
  },
];
```

### Step 2: Create modules for the arc

Each module in the new arc uses `"arc": "specialist"` in its `_module.json`. Follow the "Adding a New Module" steps above.

### Step 3: Add modules to MODULE_ORDER

Add all new module slugs to `src/lib/constants.ts`.

### Step 4: Verify and push

```bash
npm run build
npm run lint
npm test
git add -A
git commit -m "content: add Specialist Tracks arc with 5 new modules"
git push
```

---

## Quick Reference — What Goes Where

| I want to... | File to create/edit |
|-------------|-------------------|
| Add a lesson | `content/modules/XX-name/NN-slug.mdx` + update `_module.json` lessonCount |
| Add a module | New folder + `_module.json` + lessons + update `src/lib/constants.ts` MODULE_ORDER |
| Add an arc | Update `ARC_DEFINITIONS` in `src/lib/constants.ts` + create modules |
| Add a quiz question | Add to `quiz:` array in lesson MDX frontmatter |
| Add a prompt template | Edit `src/app/prompt-lab/page.tsx` |
| Add a cheatsheet section | Edit `src/app/cheatsheet/page.tsx` |
| Add a copy-paste template | Edit `src/app/templates/page.tsx` |

---

## Pre-Publish Checklist

Run through this before pushing ANY new content:

- [ ] Frontmatter has all required fields: title, slug, order, difficulty, duration, tags, objectives
- [ ] 3-5 quiz questions with explanations
- [ ] At least 2 code examples with language annotations (```bash, ```json, etc.)
- [ ] "## Key Takeaway" section at the end
- [ ] No placeholder text, "TBD", or "coming soon"
- [ ] Technically accurate for Claude Code v2.1+
- [ ] `_module.json` lessonCount updated (if adding a lesson)
- [ ] `MODULE_ORDER` updated in constants.ts (if adding a module)
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] Content reads naturally — no robotic or templated tone
- [ ] Commit message follows convention: `content: description of what was added`

---

## Commit Message Convention

Use these prefixes for content commits:

```
content: add lesson on prompt debugging to Module 2
content: add Module 14 — Real-World Projects (5 lessons)
content: enrich Module 9 lessons with more code examples
content: fix quiz answer in Module 3 Lesson 2
content: add Arabic translation for Module 1
```
