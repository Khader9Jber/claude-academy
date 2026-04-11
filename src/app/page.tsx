"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FlaskConical,
  FileText,
  Sparkles,
  GraduationCap,
  Layers,
  Zap,
  Crown,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ARC_DEFINITIONS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const arcIcons: Record<string, React.ReactNode> = {
  foundation: <Layers className="h-6 w-6" />,
  practitioner: <GraduationCap className="h-6 w-6" />,
  "power-user": <Zap className="h-6 w-6" />,
  expert: <Crown className="h-6 w-6" />,
  specialist: <Compass className="h-6 w-6" />,
};

const arcModuleCounts: Record<string, number> = {
  foundation: 4,
  practitioner: 4,
  "power-user": 3,
  expert: 2,
  specialist: 8,
};

const features = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Interactive Quizzes",
    description:
      "Test your knowledge after every lesson with multiple-choice and true/false questions.",
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Code Exercises",
    description:
      "Practice prompt writing and Claude Code commands with hands-on exercises in every module.",
  },
  {
    icon: <FlaskConical className="h-6 w-6" />,
    title: "Prompt Lab",
    description:
      "An interactive sandbox to experiment with prompting techniques and see results in real time.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Cheatsheet",
    description:
      "A quick-reference guide for every command, shortcut, and pattern you learn throughout the course.",
  },
];

const stats = [
  { value: "25", label: "Modules" },
  { value: "162", label: "Lessons" },
  { value: "600+", label: "Exercises" },
  { value: "5", label: "Skill Arcs" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8",
                "bg-accent/10 border border-accent/20 text-accent text-sm font-medium"
              )}
            >
              <Sparkles className="h-4 w-4" />
              Free and open source
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              data-testid="hero-heading"
              className="font-serif italic text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight max-w-4xl"
            >
              Master Claude{" "}
              <span className="text-accent">from Zero to Hero</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed"
            >
              A comprehensive, free learning path that takes you from AI
              beginner to Claude Code expert. 25 modules, 162 lessons, and
              hundreds of hands-on exercises.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/curriculum"
                data-testid="start-learning-btn"
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl",
                  "bg-accent text-background font-semibold text-base",
                  "hover:bg-accent/90 transition-colors duration-200",
                  "shadow-lg shadow-accent/20"
                )}
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/curriculum"
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl",
                  "border border-border text-foreground font-semibold text-base",
                  "hover:bg-surface-2 hover:border-border-accent transition-colors duration-200"
                )}
              >
                View Curriculum
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section data-testid="stats-bar" className="border-y border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-muted">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Arc Cards */}
      <section data-testid="arc-cards" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-serif italic text-3xl sm:text-4xl"
            >
              Four Arcs to Mastery
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-muted text-lg max-w-2xl mx-auto"
            >
              Progress through a carefully structured learning path, from
              foundational concepts to expert-level production workflows.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {ARC_DEFINITIONS.map((arc) => (
              <Link key={arc.id} href="/curriculum" className="block">
                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "group relative rounded-2xl p-6 h-full",
                    "bg-surface border border-border",
                    "hover:border-border-accent hover:bg-surface-2",
                    "transition-all duration-300 cursor-pointer"
                  )}
                >
                  {/* Arc color indicator */}
                  <div
                    className="h-1 w-12 rounded-full mb-4"
                    style={{ backgroundColor: arc.color }}
                  />

                  {/* Icon */}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                    style={{
                      backgroundColor: `${arc.color}15`,
                      color: arc.color,
                    }}
                  >
                    {arcIcons[arc.id]}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {arc.name}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {arc.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span
                      className="font-medium"
                      style={{ color: arc.color }}
                    >
                      {arcModuleCounts[arc.id]} modules
                    </span>
                    <span>{arc.range}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-surface/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-serif italic text-3xl sm:text-4xl"
            >
              Learn by Doing
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-muted text-lg max-w-2xl mx-auto"
            >
              Every lesson includes interactive exercises, quizzes, and
              real-world examples to cement your understanding.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className={cn(
                  "flex gap-4 rounded-2xl p-6",
                  "bg-surface border border-border",
                  "hover:border-border-accent transition-colors duration-300"
                )}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-serif italic text-3xl sm:text-4xl mb-4"
            >
              Ready to begin?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted text-lg max-w-xl mx-auto mb-8"
            >
              Start with the fundamentals and work your way up to expert-level
              Claude workflows. No prior AI experience required.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/curriculum"
                data-testid="start-learning-btn"
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl",
                  "bg-accent text-background font-semibold text-base",
                  "hover:bg-accent/90 transition-colors duration-200",
                  "shadow-lg shadow-accent/20"
                )}
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
