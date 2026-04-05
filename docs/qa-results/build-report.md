# Build Validation Report

**Date:** 2026-04-04
**Tool:** Next.js 16.2.2 (Turbopack)
**Command:** `npm run build`

---

## Build Result: PASS

| Metric | Value |
|--------|-------|
| Status | Success |
| Compiler | Turbopack |
| Compile time | ~1675ms |
| TypeScript check | Passed (2.1s) |
| TypeScript errors | 0 |
| Static page generation | 96 routes |
| Page generation time | 540ms |
| Workers used | 11 |
| Warnings | 0 |

---

## Routes Generated (96 total)

### Static Pages (prerendered as static content)

| Route | Type |
|-------|------|
| `/` | Static |
| `/_not-found` | Static |
| `/cheatsheet` | Static |
| `/curriculum` | Static |
| `/progress` | Static |
| `/prompt-lab` | Static |
| `/templates` | Static |

### SSG Pages (prerendered with generateStaticParams)

| Route | Variants |
|-------|----------|
| `/curriculum/[moduleSlug]` | 13 modules |
| `/curriculum/[moduleSlug]/[lessonSlug]` | 74 lessons |

### Route Breakdown

- 7 static pages
- 13 module pages (SSG)
- 74 lesson pages (SSG)
- 1 `_not-found` page
- 1 internal route overhead
- **Total: 96 routes**

---

## Build Output Configuration

| Setting | Value |
|---------|-------|
| `output` | `export` (static HTML export) |
| `images.unoptimized` | `true` |
| `pageExtensions` | `ts, tsx, md, mdx` |

---

## TypeScript Validation

TypeScript compilation completed successfully with zero errors. All source files, types, and imports resolve correctly.

---

## Conclusion

The build completes without errors or warnings. All 96 routes generate successfully as static HTML, confirming the site is ready for static deployment.
