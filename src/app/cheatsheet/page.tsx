"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Terminal,
  Command,
  Settings,
  Plug,
  Bot,
  Webhook,
  Keyboard,
  FileCode,
  FolderCog,
  Gauge,
  Variable,
  Shield,
  AtSign,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CheatsheetTab =
  | "All"
  | "CLI"
  | "Commands"
  | "Config"
  | "MCP"
  | "Agents"
  | "Hooks"
  | "Shortcuts";

interface CheatsheetItem {
  command: string;
  description: string;
}

interface CheatsheetSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  tab: CheatsheetTab;
  items: CheatsheetItem[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SECTIONS: CheatsheetSection[] = [
  {
    id: "core-cli",
    title: "Core CLI Commands",
    icon: <Terminal className="h-4 w-4" />,
    tab: "CLI",
    items: [
      { command: "claude", description: "Start an interactive REPL session" },
      { command: "claude -p \"prompt\"", description: "Run a one-shot prompt without interactive mode" },
      { command: "claude -c", description: "Continue the most recent conversation" },
      { command: "claude -r id", description: "Resume a specific conversation by session ID" },
      { command: "claude -w", description: "Start a session in a new git worktree (parallel work)" },
      { command: "claude -n", description: "Start a new session explicitly (no resume prompt)" },
      { command: "claude update", description: "Update Claude Code to the latest version" },
      { command: "claude doctor", description: "Run diagnostics to check your setup" },
      { command: "claude mcp add name", description: "Add a new MCP server by name" },
      { command: "claude mcp list", description: "List all configured MCP servers" },
      { command: "claude mcp remove name", description: "Remove an MCP server" },
    ],
  },
  {
    id: "cli-flags",
    title: "CLI Flags",
    icon: <Command className="h-4 w-4" />,
    tab: "CLI",
    items: [
      { command: "--model <name>", description: "Override the default model (e.g. claude-sonnet-4-20250514)" },
      { command: "--effort <level>", description: "Set reasoning effort: low, medium, high, or max" },
      { command: "--continue", description: "Continue the most recent conversation" },
      { command: "--resume <id>", description: "Resume a specific conversation by session ID" },
      { command: "--worktree", description: "Create a git worktree for parallel work" },
      { command: "--max-turns <n>", description: "Limit the number of agentic turns in non-interactive mode" },
      { command: "--output-format json", description: "Output as JSON (for scripting/piping)" },
      { command: "--verbose", description: "Enable verbose logging output" },
      { command: "--add-dir <path>", description: "Add additional directory context" },
      { command: "--allowedTools <tools>", description: "Restrict available tools (comma-separated list)" },
      { command: "--from-pr <url>", description: "Start a session from a GitHub PR URL" },
    ],
  },
  {
    id: "slash-commands",
    title: "Essential Slash Commands",
    icon: <Command className="h-4 w-4" />,
    tab: "Commands",
    items: [
      { command: "/clear", description: "Clear conversation history and start fresh" },
      { command: "/compact", description: "Summarize and compact the conversation context" },
      { command: "/context", description: "Show the current context window usage" },
      { command: "/model <name>", description: "Switch to a different model mid-session" },
      { command: "/effort <level>", description: "Change reasoning effort level" },
      { command: "/plan", description: "Enter plan mode — Claude drafts a plan before acting" },
      { command: "/execute", description: "Execute the current plan" },
      { command: "/fork", description: "Fork the conversation into a parallel branch" },
      { command: "/rewind", description: "Go back to a previous message in the conversation" },
      { command: "/resume", description: "List and resume a previous conversation" },
      { command: "/batch", description: "Run a prompt across multiple files" },
      { command: "/simplify", description: "Review changed code for reuse, quality, and efficiency" },
      { command: "/loop <interval> <cmd>", description: "Run a slash command on a recurring interval" },
      { command: "/voice", description: "Toggle voice input mode" },
      { command: "/mcp", description: "Manage MCP servers in-session" },
      { command: "/hooks", description: "View and manage lifecycle hooks" },
      { command: "/config", description: "View or modify configuration" },
      { command: "/help", description: "Show all available commands" },
    ],
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    icon: <Keyboard className="h-4 w-4" />,
    tab: "Shortcuts",
    items: [
      { command: "Ctrl + C", description: "Cancel current generation or tool execution" },
      { command: "Ctrl + D", description: "Exit the REPL / end session" },
      { command: "Tab", description: "Autocomplete file paths and commands" },
      { command: "Alt + T", description: "Toggle tool output visibility" },
      { command: "Ctrl + O", description: "Open a file in your editor from the session" },
      { command: "Esc Esc", description: "Double-tap Escape to cancel and edit your last message" },
      { command: "Shift + Enter", description: "Insert a newline in multi-line input" },
      { command: "Ctrl + B", description: "Background the current session" },
      { command: "Shift + Up/Down", description: "Scroll through message history" },
    ],
  },
  {
    id: "claude-md-locations",
    title: "CLAUDE.md Locations",
    icon: <FileCode className="h-4 w-4" />,
    tab: "Config",
    items: [
      { command: "~/.claude/CLAUDE.md", description: "User-level — applies to all your sessions everywhere" },
      { command: "./CLAUDE.md", description: "Project root — shared with the team via git" },
      { command: "./.claude/CLAUDE.md", description: "Project root (hidden) — alternative location" },
      { command: "./src/CLAUDE.md", description: "Subdirectory — scoped rules for that folder and below" },
      { command: "Auto-memory (~/.claude/user_memory.md)", description: "Claude learns preferences over time and saves them here" },
    ],
  },
  {
    id: "config-files",
    title: "Configuration Files",
    icon: <FolderCog className="h-4 w-4" />,
    tab: "Config",
    items: [
      { command: "~/.claude/settings.json", description: "User-level settings — permissions, model prefs, global tool config" },
      { command: ".claude/settings.json", description: "Project-level settings — shared with the team (committed)" },
      { command: ".claude/settings.local.json", description: "Project-level local overrides — gitignored, personal tweaks" },
    ],
  },
  {
    id: "hook-events",
    title: "Hook Events",
    icon: <Webhook className="h-4 w-4" />,
    tab: "Hooks",
    items: [
      { command: "PreToolUse", description: "Fires before Claude runs any tool — validate, block, or modify" },
      { command: "PostToolUse", description: "Fires after a tool completes — transform output, trigger side effects" },
      { command: "UserPromptSubmit", description: "Fires when the user sends a message — preprocess, validate input" },
      { command: "SessionStart", description: "Fires when a new session begins — setup environment, load context" },
      { command: "Notification", description: "Fires when Claude sends a notification — route to Slack, email, etc." },
      { command: "TeammateIdle", description: "Fires when an agent teammate goes idle — reassign work, alert user" },
      { command: "TaskCompleted", description: "Fires when an agent finishes a task — log results, chain next task" },
      { command: "Elicitation", description: "Fires when Claude asks the user a question — auto-answer, log" },
      { command: "ElicitationResult", description: "Fires when the user responds to an elicitation" },
      { command: "WorktreeCreate", description: "Fires when a git worktree is created — setup hooks, install deps" },
      { command: "WorktreeRemove", description: "Fires when a git worktree is removed — cleanup" },
    ],
  },
  {
    id: "mcp-transports",
    title: "MCP Transports",
    icon: <Plug className="h-4 w-4" />,
    tab: "MCP",
    items: [
      { command: "stdio", description: "Local process communication — best for local tools and scripts" },
      { command: "HTTP (Streamable HTTP)", description: "Remote server — for cloud-hosted MCP servers" },
      { command: "SSE (Server-Sent Events)", description: "Legacy streaming transport — still supported but prefer HTTP" },
      { command: "Scope: user (~/.claude/)", description: "User-scoped MCP server — available in all your projects" },
      { command: "Scope: project (.claude/)", description: "Project-scoped MCP server — shared with team" },
    ],
  },
  {
    id: "effort-levels",
    title: "Effort Levels",
    icon: <Gauge className="h-4 w-4" />,
    tab: "Agents",
    items: [
      { command: "low", description: "Quick answers, minimal reasoning — for simple lookups and yes/no questions" },
      { command: "medium", description: "Balanced — default level, good for most tasks" },
      { command: "high", description: "Thorough reasoning — for complex code reviews, architecture decisions" },
      { command: "max", description: "Maximum reasoning depth — for the hardest problems, multi-step analysis" },
      { command: "ultrathink", description: "Keyword in prompt to trigger extended thinking budget beyond max" },
    ],
  },
  {
    id: "env-vars",
    title: "Environment Variables",
    icon: <Variable className="h-4 w-4" />,
    tab: "Config",
    items: [
      { command: "ANTHROPIC_API_KEY", description: "Your API key — required for direct API usage" },
      { command: "ENABLE_LSP_TOOL", description: "Enable the LSP (Language Server Protocol) tool for code intelligence" },
      { command: "MAX_THINKING_TOKENS", description: "Override the maximum tokens allocated to extended thinking" },
      { command: "CLAUDE_CODE_EFFORT_LEVEL", description: "Set default effort level via environment variable" },
      { command: "ENABLE_SESSION_BACKGROUNDING", description: "Allow backgrounding sessions with Ctrl+B" },
    ],
  },
  {
    id: "permission-patterns",
    title: "Permission Patterns",
    icon: <Shield className="h-4 w-4" />,
    tab: "Agents",
    items: [
      { command: "Read", description: "Allow reading all files" },
      { command: "Read(src/**)", description: "Allow reading only files under src/" },
      { command: "Write", description: "Allow writing to all files" },
      { command: "Write(src/**)", description: "Allow writing only to files under src/" },
      { command: "Bash(git *)", description: "Allow git commands only" },
      { command: "Bash(npm test)", description: "Allow only npm test command" },
      { command: "mcp__*", description: "Allow all MCP tools" },
      { command: "mcp__server__tool", description: "Allow a specific MCP server tool" },
    ],
  },
  {
    id: "in-session-syntax",
    title: "In-Session Syntax",
    icon: <AtSign className="h-4 w-4" />,
    tab: "Commands",
    items: [
      { command: "@file.ts", description: "Reference a specific file — adds it to context" },
      { command: "@src/components/", description: "Reference a directory — adds file listing to context" },
      { command: "@**/*.test.ts", description: "Reference files via glob pattern" },
      { command: "!npm test", description: "Run a shell command and include its output in context" },
      { command: "@agent-name", description: "Mention a teammate agent by name in multi-agent setup" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Tab metadata
// ---------------------------------------------------------------------------

const TABS: { id: CheatsheetTab; label: string; icon: React.ReactNode }[] = [
  { id: "All", label: "All", icon: <BookOpen className="h-4 w-4" /> },
  { id: "CLI", label: "CLI", icon: <Terminal className="h-4 w-4" /> },
  { id: "Commands", label: "Commands", icon: <Command className="h-4 w-4" /> },
  { id: "Config", label: "Config", icon: <Settings className="h-4 w-4" /> },
  { id: "MCP", label: "MCP", icon: <Plug className="h-4 w-4" /> },
  { id: "Agents", label: "Agents", icon: <Bot className="h-4 w-4" /> },
  { id: "Hooks", label: "Hooks", icon: <Webhook className="h-4 w-4" /> },
  { id: "Shortcuts", label: "Shortcuts", icon: <Keyboard className="h-4 w-4" /> },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CheatsheetPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<CheatsheetTab>("All");

  const filteredSections = useMemo(() => {
    const query = search.toLowerCase().trim();

    return SECTIONS.map((section) => {
      // Tab filter
      if (activeTab !== "All" && section.tab !== activeTab) return null;

      // Search filter
      if (!query) return section;

      const matchingItems = section.items.filter(
        (item) =>
          item.command.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );

      if (matchingItems.length === 0) {
        // Also check section title
        if (section.title.toLowerCase().includes(query)) return section;
        return null;
      }

      return { ...section, items: matchingItems };
    }).filter(Boolean) as CheatsheetSection[];
  }, [search, activeTab]);

  const totalItems = SECTIONS.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BookOpen className="h-5 w-5" />
            </div>
            <Badge variant="accent">Reference</Badge>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground mb-4">
            Claude Code Cheatsheet
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Every command, shortcut, configuration option, and syntax pattern in one
            searchable reference. {totalItems} items across {SECTIONS.length} categories.
          </p>
        </div>
      </section>

      {/* Search + Tabs + Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder="Search commands, shortcuts, config..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface pl-12 pr-4 py-3 text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-accent text-background"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-accent"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sections */}
          {filteredSections.length === 0 ? (
            <div className="py-20 text-center">
              <Search className="mx-auto h-10 w-10 text-muted/30 mb-4" />
              <p className="text-muted text-lg">No results found for &ldquo;{search}&rdquo;</p>
              <p className="text-muted/60 text-sm mt-1">Try a different search term or switch tabs.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-xl border border-border bg-surface overflow-hidden"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface-2">
                    <span className="text-accent">{section.icon}</span>
                    <h3 className="font-semibold text-foreground">{section.title}</h3>
                    <Badge variant="default" className="ml-auto">
                      {section.items.length}
                    </Badge>
                  </div>

                  {/* Items table */}
                  <div className="divide-y divide-border">
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-3 hover:bg-surface-2/50 transition-colors"
                      >
                        <code className="shrink-0 font-mono text-sm text-accent whitespace-nowrap">
                          {item.command}
                        </code>
                        <span className="text-sm text-muted">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
