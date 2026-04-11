import type { Achievement } from "@/types/progress";

export const SITE_NAME = "Klaude Academy";

export const SITE_DESCRIPTION =
  "Master Claude from zero to hero. A free, comprehensive learning path covering everything from AI fundamentals to advanced agent workflows.";

export interface ArcDefinition {
  id: string;
  name: string;
  color: string;
  description: string;
  range: string;
}

export const ARC_DEFINITIONS: ArcDefinition[] = [
  {
    id: "foundation",
    name: "Foundation",
    color: "#5cb870",
    description:
      "Build your base. Learn what Claude is, how to write effective prompts, and get comfortable with Claude Code's core features.",
    range: "Modules 1-4",
  },
  {
    id: "practitioner",
    name: "Practitioner",
    color: "#5e9ed6",
    description:
      "Level up your workflow. Master configuration, context management, Git integration, and the Model Context Protocol.",
    range: "Modules 5-8, 14",
  },
  {
    id: "power-user",
    name: "Power User",
    color: "#a07ed6",
    description:
      "Automate and extend. Build custom hooks, work with agents and skills, and design advanced multi-step workflows.",
    range: "Modules 9-11, 15",
  },
  {
    id: "expert",
    name: "Expert",
    color: "#d4a053",
    description:
      "Go to production. Deploy Claude in enterprise environments, handle security and compliance, and complete a capstone project.",
    range: "Modules 12-13, 16-17",
  },
];

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
  "real-world-projects",
  "claude-for-teams",
  "claude-api-sdk",
  "claude-security",
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "footprints",
    condition: "completedLessons.length >= 1",
  },
  {
    id: "five-lessons",
    title: "Getting Warmed Up",
    description: "Complete 5 lessons",
    icon: "flame",
    condition: "completedLessons.length >= 5",
  },
  {
    id: "ten-lessons",
    title: "Dedicated Learner",
    description: "Complete 10 lessons",
    icon: "book-open",
    condition: "completedLessons.length >= 10",
  },
  {
    id: "twenty-five-lessons",
    title: "Knowledge Seeker",
    description: "Complete 25 lessons",
    icon: "graduation-cap",
    condition: "completedLessons.length >= 25",
  },
  {
    id: "all-lessons",
    title: "Completionist",
    description: "Complete every lesson in the curriculum",
    icon: "trophy",
    condition: "completedLessons.length >= 70",
  },
  {
    id: "foundation-arc",
    title: "Foundation Built",
    description: "Complete all Foundation arc modules",
    icon: "layers",
    condition: "foundation_arc_complete",
  },
  {
    id: "practitioner-arc",
    title: "Practitioner Unlocked",
    description: "Complete all Practitioner arc modules",
    icon: "wrench",
    condition: "practitioner_arc_complete",
  },
  {
    id: "power-user-arc",
    title: "Power Unleashed",
    description: "Complete all Power User arc modules",
    icon: "zap",
    condition: "power_user_arc_complete",
  },
  {
    id: "quiz-ace",
    title: "Quiz Ace",
    description: "Score 100% on any quiz",
    icon: "check-circle",
    condition: "any_quiz_perfect",
  },
  {
    id: "streak-3",
    title: "Three Day Streak",
    description: "Learn for 3 days in a row",
    icon: "calendar-check",
    condition: "currentStreak >= 3",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Learn for 7 days in a row",
    icon: "calendar-range",
    condition: "currentStreak >= 7",
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Learn for 30 days in a row",
    icon: "crown",
    condition: "currentStreak >= 30",
  },
];
