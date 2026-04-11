import type { MetadataRoute } from "next";
import { getModules } from "@/lib/content";

export const dynamic = "force-static";

const BASE_URL = "https://klaude-academy.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const modules = getModules();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/curriculum`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/prompt-lab`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cheatsheet`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/templates`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];

  // Module pages
  const modulePages: MetadataRoute.Sitemap = modules.map((mod) => ({
    url: `${BASE_URL}/curriculum/${mod.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Lesson pages
  const lessonPages: MetadataRoute.Sitemap = modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      url: `${BASE_URL}/curriculum/${mod.slug}/${lesson.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...modulePages, ...lessonPages];
}
