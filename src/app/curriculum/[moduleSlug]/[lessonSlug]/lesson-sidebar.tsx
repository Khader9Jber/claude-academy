"use client";

import { SidebarNav } from "@/components/layout";
import type { Module } from "@/types/content";

interface LessonSidebarProps {
  module: Module;
  currentLessonSlug: string;
}

export function LessonSidebar({ module, currentLessonSlug }: LessonSidebarProps) {
  return <SidebarNav module={module} currentLessonSlug={currentLessonSlug} />;
}
