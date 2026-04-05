import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Module, Lesson } from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content", "modules");

interface ModuleMetadata {
  title: string;
  slug: string;
  description: string;
  arc: "foundation" | "practitioner" | "power-user" | "expert";
  order: number;
  icon: string;
  color: string;
  estimatedHours: number;
  prerequisites: string[];
  lessonCount: number;
}

/**
 * Get all modules with their metadata and lessons
 */
export function getModules(): Module[] {
  const moduleDirs = fs.readdirSync(CONTENT_DIR).filter((dir) => {
    const fullPath = path.join(CONTENT_DIR, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  const modules: Module[] = moduleDirs
    .map((dir) => {
      const metaPath = path.join(CONTENT_DIR, dir, "_module.json");
      if (!fs.existsSync(metaPath)) return null;

      const metaContent = fs.readFileSync(metaPath, "utf-8");
      const meta: ModuleMetadata = JSON.parse(metaContent);

      const lessons = getLessonsForModule(dir, meta.slug);

      return {
        slug: meta.slug,
        title: meta.title,
        description: meta.description,
        arc: meta.arc,
        order: meta.order,
        icon: meta.icon,
        color: meta.color,
        estimatedHours: meta.estimatedHours,
        prerequisites: meta.prerequisites,
        lessons,
      } satisfies Module;
    })
    .filter((m): m is Module => m !== null);

  return modules.sort((a, b) => a.order - b.order);
}

/**
 * Get a single module by slug, including its lessons
 */
export function getModule(slug: string): Module | null {
  const modules = getModules();
  return modules.find((m) => m.slug === slug) ?? null;
}

/**
 * Get a single lesson by module slug and lesson slug
 */
export function getLesson(
  moduleSlug: string,
  lessonSlug: string
): Lesson | null {
  const moduleDirs = fs.readdirSync(CONTENT_DIR);
  const moduleDir = moduleDirs.find((dir) => {
    const metaPath = path.join(CONTENT_DIR, dir, "_module.json");
    if (!fs.existsSync(metaPath)) return false;
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    return meta.slug === moduleSlug;
  });

  if (!moduleDir) return null;

  const modulePath = path.join(CONTENT_DIR, moduleDir);
  const mdxFiles = fs.readdirSync(modulePath).filter((f) => f.endsWith(".mdx"));

  for (const file of mdxFiles) {
    const filePath = path.join(modulePath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    if (data.slug === lessonSlug) {
      return {
        slug: data.slug,
        moduleSlug,
        title: data.title,
        order: data.order ?? 0,
        difficulty: data.difficulty ?? "beginner",
        duration: data.duration ?? 10,
        tags: data.tags ?? [],
        objectives: data.objectives ?? [],
        content,
      } satisfies Lesson;
    }
  }

  return null;
}

/**
 * Get a flat list of all lessons across all modules
 */
export function getAllLessons(): Lesson[] {
  const modules = getModules();
  return modules.flatMap((m) => m.lessons);
}

/**
 * Get all module directory names mapped to their slugs
 */
export function getModuleSlugs(): string[] {
  return getModules().map((m) => m.slug);
}

/**
 * Get lesson slugs for a given module
 */
export function getLessonSlugs(moduleSlug: string): string[] {
  const mod = getModule(moduleSlug);
  if (!mod) return [];
  return mod.lessons.map((l) => l.slug);
}

// --- Internal helpers ---

function getLessonsForModule(dirName: string, moduleSlug: string): Lesson[] {
  const modulePath = path.join(CONTENT_DIR, dirName);
  const files = fs.readdirSync(modulePath).filter((f) => f.endsWith(".mdx"));

  const lessons: Lesson[] = files.map((file) => {
    const filePath = path.join(modulePath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug: data.slug ?? file.replace(".mdx", ""),
      moduleSlug,
      title: data.title ?? "Untitled Lesson",
      order: data.order ?? 0,
      difficulty: data.difficulty ?? "beginner",
      duration: data.duration ?? 10,
      tags: data.tags ?? [],
      objectives: data.objectives ?? [],
      content,
    };
  });

  return lessons.sort((a, b) => a.order - b.order);
}
