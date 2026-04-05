# Content Validation Report

**Date:** 2026-04-05
**Validator:** scripts/validate-content.ts

---

## Summary

| Metric | Value |
|--------|-------|
| Total MDX files checked | 74 |
| Files passing all checks | 74 |
| Files with issues | 0 |
| Pass rate | 100.0% |

## Content Statistics

| Metric | Value |
|--------|-------|
| Total quiz questions | 294 |
| Average lesson duration | 15.0 min |
| Total curriculum time | 1107 min (18.4h) |

### Difficulty Distribution

| Difficulty | Count |
|------------|-------|
| Beginner | 22 |
| Intermediate | 22 |
| Advanced | 19 |
| Expert | 11 |

### Lessons Per Module

| Module | MDX Files |
|--------|-----------|
| 01-claude-fundamentals | 4 |
| 02-prompt-engineering | 8 |
| 03-claude-code-basics | 5 |
| 04-commands-and-navigation | 5 |
| 05-claude-md-and-config | 6 |
| 06-session-and-context | 5 |
| 07-git-and-workflows | 6 |
| 08-mcp-fundamentals | 5 |
| 09-hooks-and-automation | 5 |
| 10-agents-and-skills | 7 |
| 11-advanced-workflows | 7 |
| 12-enterprise-and-production | 7 |
| 13-capstone | 4 |

---

## Issues

No issues found. All 74 files pass all validation checks.

---

## Validation Checks Performed

1. Valid YAML frontmatter (parseable with gray-matter)
2. Required fields present: title, slug, order, difficulty, duration
3. Difficulty is one of: beginner, intermediate, advanced, expert
4. Duration is a positive number
5. Quiz questions have: id, question, options (array), correct (number), explanation
6. Content body is non-empty (at least 100 characters)
7. File is in the correct module directory
