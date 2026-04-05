import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.resolve(__dirname, '../content/modules')
const OUTPUT_FILE = path.resolve(__dirname, '../docs/qa-results/content-validation.md')

interface Issue {
  file: string
  issues: string[]
}

interface QuizQuestion {
  id?: string
  question?: string
  options?: string[]
  correct?: number
  explanation?: string
  type?: string
}

interface Stats {
  totalFiles: number
  passingFiles: number
  failingFiles: number
  totalQuizzes: number
  totalDuration: number
  difficulties: Record<string, number>
  moduleCounts: Record<string, number>
  issuesList: Issue[]
}

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert']

function validateMdxFile(filePath: string, moduleDirName: string): { issues: string[]; quizCount: number; duration: number; difficulty: string } {
  const issues: string[] = []
  let quizCount = 0
  let duration = 0
  let difficulty = ''

  // Read file
  let rawContent: string
  try {
    rawContent = fs.readFileSync(filePath, 'utf-8')
  } catch {
    issues.push('Could not read file')
    return { issues, quizCount, duration, difficulty }
  }

  // Parse frontmatter
  let data: Record<string, unknown>
  let content: string
  try {
    const parsed = matter(rawContent)
    data = parsed.data
    content = parsed.content
  } catch (e) {
    issues.push(`Invalid YAML frontmatter: ${e instanceof Error ? e.message : String(e)}`)
    return { issues, quizCount, duration, difficulty }
  }

  // Required fields
  const requiredFields = ['title', 'slug', 'order', 'difficulty', 'duration']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      issues.push(`Missing required frontmatter field: ${field}`)
    }
  }

  // Validate difficulty
  if (data.difficulty && typeof data.difficulty === 'string') {
    difficulty = data.difficulty
    if (!VALID_DIFFICULTIES.includes(data.difficulty)) {
      issues.push(`Invalid difficulty "${data.difficulty}" — must be one of: ${VALID_DIFFICULTIES.join(', ')}`)
    }
  }

  // Validate duration
  if (data.duration !== undefined) {
    const dur = Number(data.duration)
    if (isNaN(dur) || dur <= 0) {
      issues.push(`Duration must be a positive number, got: ${data.duration}`)
    } else {
      duration = dur
    }
  }

  // Validate quiz questions (if present)
  if (data.quiz) {
    if (!Array.isArray(data.quiz)) {
      issues.push('quiz field is not an array')
    } else {
      quizCount = data.quiz.length
      data.quiz.forEach((q: QuizQuestion, i: number) => {
        const prefix = `Quiz question ${i + 1}`
        if (!q.id) issues.push(`${prefix}: missing id`)
        if (!q.question) issues.push(`${prefix}: missing question`)
        if (!Array.isArray(q.options) || q.options.length === 0) {
          issues.push(`${prefix}: missing or empty options array`)
        }
        if (q.correct === undefined || q.correct === null) {
          issues.push(`${prefix}: missing correct answer index`)
        } else if (typeof q.correct !== 'number') {
          // correct can be a number or array — check type
          if (!Array.isArray(q.correct)) {
            issues.push(`${prefix}: correct must be a number or array`)
          }
        }
        if (!q.explanation) issues.push(`${prefix}: missing explanation`)
      })
    }
  }

  // Check content body is non-empty
  const trimmedContent = content.trim()
  if (trimmedContent.length < 100) {
    issues.push(`Content body too short (${trimmedContent.length} chars, minimum 100)`)
  }

  // Check file is in correct module directory
  const relPath = path.relative(CONTENT_DIR, filePath)
  const dirPart = relPath.split(path.sep)[0]
  if (dirPart !== moduleDirName) {
    issues.push(`File is in "${dirPart}" but expected "${moduleDirName}"`)
  }

  return { issues, quizCount, duration, difficulty }
}

function main() {
  const stats: Stats = {
    totalFiles: 0,
    passingFiles: 0,
    failingFiles: 0,
    totalQuizzes: 0,
    totalDuration: 0,
    difficulties: {},
    moduleCounts: {},
    issuesList: [],
  }

  // Get all module directories
  const moduleDirs = fs.readdirSync(CONTENT_DIR)
    .filter(d => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory())
    .sort()

  for (const moduleDir of moduleDirs) {
    const modulePath = path.join(CONTENT_DIR, moduleDir)
    const mdxFiles = fs.readdirSync(modulePath)
      .filter(f => f.endsWith('.mdx'))
      .sort()

    stats.moduleCounts[moduleDir] = mdxFiles.length

    for (const mdxFile of mdxFiles) {
      const filePath = path.join(modulePath, mdxFile)
      const relPath = `${moduleDir}/${mdxFile}`
      stats.totalFiles++

      const result = validateMdxFile(filePath, moduleDir)
      stats.totalQuizzes += result.quizCount
      stats.totalDuration += result.duration

      if (result.difficulty) {
        stats.difficulties[result.difficulty] = (stats.difficulties[result.difficulty] || 0) + 1
      }

      if (result.issues.length > 0) {
        stats.failingFiles++
        stats.issuesList.push({ file: relPath, issues: result.issues })
      } else {
        stats.passingFiles++
      }
    }
  }

  // Generate report
  const avgDuration = stats.totalFiles > 0 ? (stats.totalDuration / stats.totalFiles).toFixed(1) : '0'

  let report = `# Content Validation Report

**Date:** ${new Date().toISOString().split('T')[0]}
**Validator:** scripts/validate-content.ts

---

## Summary

| Metric | Value |
|--------|-------|
| Total MDX files checked | ${stats.totalFiles} |
| Files passing all checks | ${stats.passingFiles} |
| Files with issues | ${stats.failingFiles} |
| Pass rate | ${stats.totalFiles > 0 ? ((stats.passingFiles / stats.totalFiles) * 100).toFixed(1) : 0}% |

## Content Statistics

| Metric | Value |
|--------|-------|
| Total quiz questions | ${stats.totalQuizzes} |
| Average lesson duration | ${avgDuration} min |
| Total curriculum time | ${stats.totalDuration} min (${(stats.totalDuration / 60).toFixed(1)}h) |

### Difficulty Distribution

| Difficulty | Count |
|------------|-------|
| Beginner | ${stats.difficulties['beginner'] || 0} |
| Intermediate | ${stats.difficulties['intermediate'] || 0} |
| Advanced | ${stats.difficulties['advanced'] || 0} |
| Expert | ${stats.difficulties['expert'] || 0} |

### Lessons Per Module

| Module | MDX Files |
|--------|-----------|
`

  for (const [mod, count] of Object.entries(stats.moduleCounts)) {
    report += `| ${mod} | ${count} |\n`
  }

  report += `\n---\n\n`

  if (stats.issuesList.length > 0) {
    report += `## Files With Issues\n\n`
    for (const item of stats.issuesList) {
      report += `### ${item.file}\n\n`
      for (const issue of item.issues) {
        report += `- ${issue}\n`
      }
      report += `\n`
    }
  } else {
    report += `## Issues\n\nNo issues found. All ${stats.totalFiles} files pass all validation checks.\n`
  }

  report += `\n---\n\n## Validation Checks Performed\n\n`
  report += `1. Valid YAML frontmatter (parseable with gray-matter)\n`
  report += `2. Required fields present: title, slug, order, difficulty, duration\n`
  report += `3. Difficulty is one of: beginner, intermediate, advanced, expert\n`
  report += `4. Duration is a positive number\n`
  report += `5. Quiz questions have: id, question, options (array), correct (number), explanation\n`
  report += `6. Content body is non-empty (at least 100 characters)\n`
  report += `7. File is in the correct module directory\n`

  // Write report
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, report)
  console.log(`Content validation complete. Report saved to: ${OUTPUT_FILE}`)
  console.log(`  Total files: ${stats.totalFiles}`)
  console.log(`  Passing: ${stats.passingFiles}`)
  console.log(`  Failing: ${stats.failingFiles}`)
}

main()
