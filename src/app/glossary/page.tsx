"use client";

import { useState, useMemo, useRef } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  Brain,
  Terminal,
  Code2,
  Plug,
  ShieldCheck,
  X,
  ExternalLink,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category =
  | "Anthropic & Claude"
  | "LLM Fundamentals"
  | "Claude Code"
  | "API & Engineering"
  | "MCP"
  | "Safety & Alignment";

type FilterValue = "All" | Category;

interface GlossaryTerm {
  id: string;
  term: string;
  aliases?: string[];
  category: Category;
  short: string;
  long: string;
  related?: string[];
  links?: { label: string; href: string }[];
}

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

const CATEGORY_META: Record<
  Category,
  { icon: React.ReactNode; color: string; dotClass: string }
> = {
  "Anthropic & Claude": {
    icon: <Sparkles className="h-4 w-4" />,
    color: "#d4a053",
    dotClass: "bg-accent",
  },
  "LLM Fundamentals": {
    icon: <Brain className="h-4 w-4" />,
    color: "#5e9ed6",
    dotClass: "bg-blue",
  },
  "Claude Code": {
    icon: <Terminal className="h-4 w-4" />,
    color: "#5cb870",
    dotClass: "bg-green",
  },
  "API & Engineering": {
    icon: <Code2 className="h-4 w-4" />,
    color: "#a07ed6",
    dotClass: "bg-purple",
  },
  MCP: {
    icon: <Plug className="h-4 w-4" />,
    color: "#5ec4c4",
    dotClass: "bg-cyan",
  },
  "Safety & Alignment": {
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "#d65ea0",
    dotClass: "bg-pink",
  },
};

const CATEGORIES: Category[] = [
  "Anthropic & Claude",
  "LLM Fundamentals",
  "Claude Code",
  "API & Engineering",
  "MCP",
  "Safety & Alignment",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Data: Glossary Terms
// ---------------------------------------------------------------------------

const TERMS_RAW: Omit<GlossaryTerm, "id">[] = [
  // ── Anthropic & Claude ───────────────────────────────────────────────
  {
    term: "Anthropic",
    category: "Anthropic & Claude",
    short: "AI safety company founded in 2021, creator of the Claude model family.",
    long: "Anthropic was founded in 2021 by former OpenAI researchers including Dario and Daniela Amodei. The company focuses on AI safety research and builds the Claude family of large language models.",
    related: ["Claude", "Constitutional AI (CAI)", "AI Safety"],
    links: [{ label: "anthropic.com", href: "https://www.anthropic.com" }],
  },
  {
    term: "Claude",
    category: "Anthropic & Claude",
    short: "Anthropic's family of large language models, named after Claude Shannon.",
    long: "Claude is a family of large language models built by Anthropic, first released in March 2023. The name honors Claude Shannon, the father of information theory. The family spans tiers (Opus, Sonnet, Haiku) tuned for different trade-offs.",
    related: ["Anthropic", "Claude Opus", "Claude Sonnet", "Claude Haiku"],
    links: [{ label: "claude.ai", href: "https://claude.ai" }],
  },
  {
    term: "Claude 4.6",
    aliases: ["Claude 4.6 family"],
    category: "Anthropic & Claude",
    short: "Latest Claude model family (2025-2026): Opus 4.6, Sonnet 4.6, Haiku 4.5.",
    long: "The Claude 4.6 generation ships three tiers tuned for different intelligence, cost, and speed trade-offs: Opus 4.6 for the hardest tasks, Sonnet 4.6 as the balanced default, and Haiku 4.5 for high-volume fast inference.",
    related: ["Claude Opus", "Claude Sonnet", "Claude Haiku"],
  },
  {
    term: "Claude Opus",
    category: "Anthropic & Claude",
    short: "The most capable and intelligent Claude tier for complex reasoning.",
    long: "Opus is the flagship Claude tier, best for complex reasoning, long-context work, research, and high-stakes outputs. It is also the most expensive. Opus 4.6 supports 1M-token context windows.",
    related: ["Claude Sonnet", "Claude Haiku", "Context Window"],
  },
  {
    term: "Claude Sonnet",
    category: "Anthropic & Claude",
    short: "The balanced Claude tier — high intelligence at ~1/5 Opus cost.",
    long: "Sonnet is the default production workhorse: strong reasoning and coding ability at roughly one-fifth the price of Opus. Sonnet 4.6 offers a 200K-token context window and is the go-to model for most agent and API applications.",
    related: ["Claude Opus", "Claude Haiku"],
  },
  {
    term: "Claude Haiku",
    category: "Anthropic & Claude",
    short: "The fast, cheap Claude tier optimized for speed and volume.",
    long: "Haiku is tuned for latency and throughput. It's ideal for classification, extraction, routing, simple Q&A, and any high-volume workload where cost matters more than deep reasoning.",
    related: ["Claude Opus", "Claude Sonnet"],
  },
  {
    term: "Claude.ai",
    category: "Anthropic & Claude",
    short: "The consumer Claude web and desktop app at claude.ai.",
    long: "Claude.ai is Anthropic's end-user product. It includes Projects (named workspaces), Artifacts (previewable outputs), Computer Use, and Skills. It's distinct from the API and Claude Code.",
    related: ["Projects", "Artifacts", "Computer Use", "Agent Skills"],
    links: [{ label: "claude.ai", href: "https://claude.ai" }],
  },
  {
    term: "Claude Code",
    category: "Anthropic & Claude",
    short: "Anthropic's CLI and IDE agent for coding in your terminal.",
    long: "Claude Code is a terminal-based agent that reads your codebase, takes autonomous actions, runs commands, edits files, and opens PRs. It pairs with CLAUDE.md for project context and supports MCP, hooks, skills, and sub-agents.",
    related: ["CLAUDE.md", "Slash Command", "Sub-Agent", "Hook"],
    links: [{ label: "Docs", href: "https://docs.claude.com/en/docs/claude-code" }],
  },
  {
    term: "Claude API",
    aliases: ["Anthropic API"],
    category: "Anthropic & Claude",
    short: "The programmatic interface at api.anthropic.com for building with Claude.",
    long: "The Anthropic API exposes Claude models over HTTPS at api.anthropic.com. The primary endpoint is the Messages API. Official SDKs exist for Python and TypeScript, and all of Anthropic's consumer and developer products sit on top of it.",
    related: ["Messages API", "Anthropic SDK", "Prompt Caching"],
    links: [{ label: "API Docs", href: "https://docs.claude.com/en/api" }],
  },
  {
    term: "Messages API",
    category: "Anthropic & Claude",
    short: "The primary API endpoint (/v1/messages) for multi-turn conversations.",
    long: "The Messages API replaced the legacy Completions API and is now the only recommended endpoint. It accepts a conversation as an array of user and assistant messages and returns a response with content blocks (text, tool_use, thinking, etc.).",
    related: ["Claude API", "Content Block", "System Prompt"],
  },
  {
    term: "Projects",
    aliases: ["Claude Projects"],
    category: "Anthropic & Claude",
    short: "Named workspaces in Claude.ai that share instructions and files across chats.",
    long: "Projects let you attach files, custom instructions, and connectors once, and reuse them across many conversations. Great for recurring workflows like coding in a specific repo or writing in a house style.",
    related: ["Claude.ai", "Artifacts"],
  },
  {
    term: "Artifacts",
    category: "Anthropic & Claude",
    short: "Interactive previewable outputs that render in a side panel in Claude.ai.",
    long: "Artifacts are first-class outputs for code, HTML, React components, SVG, Markdown, and mermaid diagrams. They render live in a side panel, are iteratively editable, and can be shared as mini-apps.",
    related: ["Claude.ai"],
  },
  {
    term: "Computer Use",
    category: "Anthropic & Claude",
    short: "Claude capability to control a computer via screenshots, keyboard, and mouse.",
    long: "Computer Use lets Claude take screenshots and issue mouse/keyboard commands to operate a desktop environment. It powers agentic browser and desktop automation and is available via the API and Claude.ai.",
    related: ["Tool Use", "Agent Skills"],
  },
  {
    term: "Agent Skills",
    aliases: ["Skills"],
    category: "Anthropic & Claude",
    short: "Reusable capability packages (SKILL.md) loaded on demand by Claude agents.",
    long: "Agent Skills package prompts, tools, and conventions into a folder with a SKILL.md manifest. Claude loads them lazily when relevant, keeping context clean while giving agents specialized capabilities like PDF editing or Notion workflows.",
    related: ["Skill", "Claude Code", "MCP"],
  },
  {
    term: "Constitutional AI (CAI)",
    aliases: ["CAI"],
    category: "Anthropic & Claude",
    short: "Anthropic's training technique using a written constitution to guide self-revision.",
    long: "Constitutional AI trains a model to critique and revise its own outputs against a set of natural-language principles (a constitution). This reduces reliance on human labelers and forms the backbone of RLAIF. It is central to how Claude is aligned.",
    related: ["Claude's Constitution", "RLAIF", "Alignment"],
    links: [
      { label: "Paper", href: "https://arxiv.org/abs/2212.08073" },
    ],
  },
  {
    term: "Claude's Constitution",
    category: "Anthropic & Claude",
    short: "The document of principles Claude is trained against.",
    long: "Claude's constitution draws from sources including the UN Declaration of Human Rights, Apple's Terms of Service, DeepMind's Sparrow principles, and Anthropic's own research. It shapes refusal behavior, helpfulness trade-offs, and honesty norms.",
    related: ["Constitutional AI (CAI)", "Honesty / Helpfulness / Harmlessness"],
  },

  // ── LLM Fundamentals ──────────────────────────────────────────────────
  {
    term: "Token",
    category: "LLM Fundamentals",
    short: "The basic unit an LLM processes — a subword chunk, not a word or character.",
    long: "Tokens are produced by byte-pair encoding (BPE). In English, roughly 1.3 tokens correspond to one word on average. Pricing, context windows, and rate limits are all measured in tokens.",
    related: ["BPE (Byte-Pair Encoding)", "Context Window", "Sampling"],
  },
  {
    term: "Context Window",
    category: "LLM Fundamentals",
    short: "The total tokens a model can consider at once (input plus output).",
    long: "The context window is the model's working memory. Everything outside it is invisible to the model in a single call. Claude Opus 4.6 supports 1M tokens; Sonnet 4.6 supports 200K. Longer contexts cost more and can degrade attention quality.",
    related: ["Token", "Max Tokens", "KV Cache"],
  },
  {
    term: "Temperature",
    category: "LLM Fundamentals",
    short: "Sampling parameter controlling randomness from 0 (deterministic) upward.",
    long: "Temperature rescales the logits distribution before sampling. 0 means always pick the top token; 1.0 is the default; values above 1 flatten the distribution and produce more diverse outputs. Low values suit factual work; higher values help creative generation.",
    related: ["Sampling", "Top-p (nucleus sampling)", "Top-k", "Logits"],
  },
  {
    term: "Top-p (nucleus sampling)",
    aliases: ["nucleus sampling", "top-p"],
    category: "LLM Fundamentals",
    short: "Sample from the smallest token set whose cumulative probability exceeds p.",
    long: "Top-p (e.g., 0.9) dynamically chooses how many tokens are in the sampling pool based on probability mass. It's often paired with temperature to control both concentration and breadth of the output distribution.",
    related: ["Temperature", "Top-k", "Sampling"],
  },
  {
    term: "Top-k",
    category: "LLM Fundamentals",
    short: "Sample only from the top k most likely tokens at each step.",
    long: "Top-k truncates the distribution to the k highest-probability tokens before sampling. It's simpler than top-p but less adaptive: a fixed k can be too narrow or too wide depending on how confident the model is.",
    related: ["Top-p (nucleus sampling)", "Temperature", "Sampling"],
  },
  {
    term: "Sampling",
    category: "LLM Fundamentals",
    short: "Selecting the next token from the model's output probability distribution.",
    long: "After the model emits a logits vector, sampling decides which token to pick. Common strategies include greedy (argmax), temperature, top-k, and top-p, often combined. Sampling is what makes LLM output stochastic.",
    related: ["Logits", "Temperature", "Top-p (nucleus sampling)", "Top-k"],
  },
  {
    term: "Logits",
    category: "LLM Fundamentals",
    short: "Raw numerical scores a model assigns to each possible next token.",
    long: "Logits are the unnormalized scores output by the final layer before softmax. Sampling parameters like temperature scale these values; the softmax converts them into probabilities used to pick the next token.",
    related: ["Sampling", "Temperature", "Token"],
  },
  {
    term: "Embedding",
    category: "LLM Fundamentals",
    short: "A vector representation of text capturing semantic meaning.",
    long: "Embeddings map text to fixed-length vectors where similar meanings map to nearby vectors. They power semantic search, retrieval, clustering, and recommendation. Anthropic does not sell embedding models directly; pair Claude with Voyage, Cohere, or OpenAI embeddings.",
    related: ["Transformer", "Self-Attention"],
  },
  {
    term: "Transformer",
    category: "LLM Fundamentals",
    short: "The neural network architecture behind modern LLMs.",
    long: "The Transformer was introduced in the 2017 paper \"Attention Is All You Need\" by Vaswani et al. It replaced recurrence with self-attention, enabling massive parallelism during training. Every major LLM today is a Transformer variant.",
    related: ["Attention Mechanism", "Self-Attention", "Pre-training"],
    links: [{ label: "Paper", href: "https://arxiv.org/abs/1706.03762" }],
  },
  {
    term: "Attention Mechanism",
    category: "LLM Fundamentals",
    short: "The core Transformer operation letting each token attend to other tokens.",
    long: "Attention computes weighted sums over tokens in the context, letting each position look at every other position. Multi-head attention runs this in parallel across different learned subspaces, enabling rich relational reasoning.",
    related: ["Self-Attention", "Transformer"],
  },
  {
    term: "Self-Attention",
    category: "LLM Fundamentals",
    short: "Each token attending to other tokens in the same sequence.",
    long: "Self-attention is attention where the queries, keys, and values all come from the same input sequence. It's what lets a Transformer layer build contextualized representations of every token based on its neighbors.",
    related: ["Attention Mechanism", "Transformer", "KV Cache"],
  },
  {
    term: "Pre-training",
    category: "LLM Fundamentals",
    short: "Initial training on massive text corpora, teaching language and world knowledge.",
    long: "Pre-training exposes the model to trillions of tokens from the web, books, and code using self-supervised next-token prediction. It produces a base model that knows language patterns but hasn't yet learned to follow instructions.",
    related: ["Fine-tuning", "SFT (Supervised Fine-Tuning)", "RLHF"],
  },
  {
    term: "Fine-tuning",
    category: "LLM Fundamentals",
    short: "Further training on a smaller, specific dataset to adapt a model.",
    long: "Fine-tuning updates a pre-trained model's weights on a narrower corpus — a domain, style, or task. It sits between pre-training and deployment, and includes SFT, RLHF, and RLAIF as common stages.",
    related: ["Pre-training", "SFT (Supervised Fine-Tuning)", "RLHF", "RLAIF"],
  },
  {
    term: "SFT (Supervised Fine-Tuning)",
    aliases: ["Supervised Fine-Tuning", "SFT"],
    category: "LLM Fundamentals",
    short: "Fine-tuning on input-output pairs with a known correct output.",
    long: "SFT is the most basic fine-tuning step: show the model a prompt and the desired response, and train it to produce that response. It usually precedes preference-based training like RLHF or RLAIF.",
    related: ["Fine-tuning", "RLHF", "RLAIF"],
  },
  {
    term: "RLHF",
    aliases: ["Reinforcement Learning from Human Feedback"],
    category: "LLM Fundamentals",
    short: "Training where humans pick the better of two model responses.",
    long: "RLHF collects human preference data between pairs of model outputs, trains a reward model on those preferences, then uses reinforcement learning (usually PPO) to align the base model to human judgments.",
    related: ["RLAIF", "SFT (Supervised Fine-Tuning)", "Constitutional AI (CAI)"],
  },
  {
    term: "RLAIF",
    aliases: ["Reinforcement Learning from AI Feedback"],
    category: "LLM Fundamentals",
    short: "Like RLHF, but AI models rate responses instead of humans.",
    long: "RLAIF replaces or augments human raters with a capable AI judge that evaluates outputs against written principles. It scales much better than RLHF and is a core mechanism behind Constitutional AI.",
    related: ["RLHF", "Constitutional AI (CAI)"],
  },
  {
    term: "Perplexity",
    category: "LLM Fundamentals",
    short: "A measure of how surprised a model is by text — lower is better.",
    long: "Perplexity is the exponential of the average negative log-likelihood per token. A model with perplexity 10 is, on average, \"choosing among 10 equally likely next tokens.\" It's a classic intrinsic evaluation metric for language models.",
    related: ["Token", "Pre-training"],
  },
  {
    term: "Hallucination",
    category: "LLM Fundamentals",
    short: "When a model generates plausible-sounding but factually incorrect content.",
    long: "Hallucinations happen when the model fills gaps with fabricated details that look right but aren't. They are an inherent LLM failure mode, mitigated with grounding, retrieval, citations, and careful prompting, but never fully eliminated.",
    related: ["Citations", "In-Context Learning"],
  },
  {
    term: "In-Context Learning",
    aliases: ["ICL"],
    category: "LLM Fundamentals",
    short: "Learning a task from prompt examples without any weight updates.",
    long: "In-context learning is the model's ability to pick up new tasks or patterns purely from examples shown inside the prompt. It enables few-shot prompting and is a key emergent property of large Transformers.",
    related: ["Zero-Shot", "Few-Shot", "Chain of Thought (CoT)"],
  },
  {
    term: "Zero-Shot",
    category: "LLM Fundamentals",
    short: "Giving the model a task with no examples — just instructions.",
    long: "Zero-shot prompting asks the model to perform a task by describing it directly. Modern LLMs do surprisingly well zero-shot on tasks they've effectively seen variants of during training.",
    related: ["Few-Shot", "In-Context Learning"],
  },
  {
    term: "Few-Shot",
    category: "LLM Fundamentals",
    short: "Providing a handful of examples (2-10) in the prompt before the task.",
    long: "Few-shot prompting shows the model a small number of input-output demonstrations before the actual question. It often boosts accuracy on formatting, classification, and reasoning tasks by anchoring the model's behavior.",
    related: ["Zero-Shot", "In-Context Learning", "Chain of Thought (CoT)"],
  },
  {
    term: "Chain of Thought (CoT)",
    aliases: ["CoT", "Chain-of-Thought"],
    category: "LLM Fundamentals",
    short: "Prompting the model to reason step-by-step before answering.",
    long: "Chain of Thought improves performance on arithmetic, logic, and multi-step reasoning by having the model write out intermediate steps. Extended Thinking in Claude is a native, trained version of this idea.",
    related: ["Extended Thinking", "Few-Shot", "In-Context Learning"],
  },
  {
    term: "System Prompt",
    category: "LLM Fundamentals",
    short: "Initial instructions setting the model's role, behavior, and constraints.",
    long: "The system prompt is separate from user and assistant messages. It persists across turns and is where you set persona, tone, policy, and task framing. In the Anthropic API it's the `system` parameter on the Messages endpoint.",
    related: ["User Message", "Assistant Message", "Messages API"],
  },
  {
    term: "User Message",
    category: "LLM Fundamentals",
    short: "A message in the conversation from the end user.",
    long: "User messages represent the human turn in a conversation. The Messages API expects an alternating sequence of user and assistant messages, with the final message typically being from the user.",
    related: ["Assistant Message", "System Prompt", "Messages API"],
  },
  {
    term: "Assistant Message",
    category: "LLM Fundamentals",
    short: "A message in the conversation from Claude.",
    long: "Assistant messages are Claude's turn. They contain content blocks (text, tool_use, thinking) and are appended to the conversation history for multi-turn interactions.",
    related: ["User Message", "System Prompt", "Content Block"],
  },
  {
    term: "Parameters (model size)",
    aliases: ["Parameters"],
    category: "LLM Fundamentals",
    short: "The trainable numbers in a neural network, usually counted in billions.",
    long: "Parameters are the learned weights of the model (e.g., a 70B-parameter model has 70 billion). Anthropic does not publish Claude's exact parameter counts. More parameters usually means more capability and more compute.",
    related: ["Pre-training", "Quantization"],
  },
  {
    term: "Quantization",
    category: "LLM Fundamentals",
    short: "Reducing model precision (fp32 to int8/int4) to save memory and run faster.",
    long: "Quantization stores weights in lower-precision formats. int8 and int4 quantization are common for local inference; they cut memory use dramatically with small quality losses. Claude itself is hosted; this matters mostly for open-weights models.",
    related: ["Parameters (model size)"],
  },
  {
    term: "KV Cache",
    category: "LLM Fundamentals",
    short: "Cached keys and values from attention layers, reused across tokens.",
    long: "During generation, the keys and values computed for prior tokens don't change — they can be cached and reused for the next token. The KV cache is the single biggest memory consumer during long-context inference.",
    related: ["Self-Attention", "Context Window", "Prompt Caching"],
  },
  {
    term: "BPE (Byte-Pair Encoding)",
    aliases: ["BPE"],
    category: "LLM Fundamentals",
    short: "The subword tokenization algorithm used by most modern LLMs, including Claude.",
    long: "BPE starts with individual bytes and iteratively merges the most frequent adjacent pairs into new tokens. The result is a vocabulary that handles arbitrary text, including code and non-English scripts, without out-of-vocabulary failures.",
    related: ["Token"],
  },
  {
    term: "Multimodal",
    category: "LLM Fundamentals",
    short: "A model that accepts multiple input types (text, images, audio).",
    long: "Multimodal models can reason across input types. Claude accepts text and images (vision); it does not natively accept audio or video today. Outputs are text and structured tool calls.",
    related: ["Vision", "Content Block"],
  },
  {
    term: "Vision",
    category: "LLM Fundamentals",
    short: "Image understanding capability — Claude reads images alongside text.",
    long: "Claude's vision capability handles screenshots, diagrams, handwritten notes, photographs, and charts. Images are passed as content blocks in the Messages API. There's no image generation; Claude describes and reasons about images only.",
    related: ["Multimodal", "Content Block"],
  },
  {
    term: "Knowledge Cutoff",
    category: "LLM Fundamentals",
    short: "The date beyond which the model has no training data.",
    long: "A model trained on data up to month X has a knowledge cutoff of that month. Events, releases, and facts after that date are unknown unless provided in the prompt or via tools. Claude 4.6's cutoff is May 2025.",
    related: ["Hallucination", "Pre-training"],
  },

  // ── Claude Code ──────────────────────────────────────────────────────
  {
    term: "CLAUDE.md",
    category: "Claude Code",
    short: "A markdown file auto-loaded by Claude Code at session start.",
    long: "CLAUDE.md contains project-specific instructions, conventions, build commands, and architecture notes. Claude Code reads user-level (~/.claude/CLAUDE.md) and project-level files automatically, layering them into context at the start of every session.",
    related: ["Session", "/init", ".claudeignore"],
  },
  {
    term: ".claudeignore",
    category: "Claude Code",
    short: "File listing paths Claude Code should skip, like .gitignore.",
    long: ".claudeignore uses gitignore-style patterns to exclude directories and files from Claude Code's search and exploration. Use it to hide build artifacts, vendored code, large binaries, and secrets from the agent.",
    related: ["CLAUDE.md", "Session"],
  },
  {
    term: "Slash Command",
    category: "Claude Code",
    short: "Commands starting with / in Claude Code, like /clear, /compact, /plan.",
    long: "Slash commands are in-session actions. Built-ins include /clear, /compact, /plan, /review, /init, /model, /effort, and /mcp. You can also define custom slash commands in .claude/commands/ as markdown files.",
    related: ["/clear", "/compact", "/review", "/init"],
  },
  {
    term: "Sub-Agent",
    aliases: ["Subagent"],
    category: "Claude Code",
    short: "A secondary Claude instance spawned for a specific task, often in parallel.",
    long: "Sub-agents run with isolated context, their own tools, and optionally their own worktree. They're ideal for parallel exploration, independent research tasks, and scoped refactors. The parent agent receives only the sub-agent's final report.",
    related: ["Worktree", "Session", "Tool Use"],
  },
  {
    term: "Skill",
    category: "Claude Code",
    short: "A reusable capability package (SKILL.md) Claude Code loads on demand.",
    long: "A Skill is a folder containing a SKILL.md manifest plus any scripts, templates, and reference docs. Claude loads the skill's instructions only when its trigger conditions match, keeping context lean while providing on-demand expertise.",
    related: ["Agent Skills", "Sub-Agent", "MCP"],
  },
  {
    term: "Hook",
    category: "Claude Code",
    short: "Shell command run automatically at Claude Code lifecycle events.",
    long: "Hooks fire on events like PreToolUse, PostToolUse, SessionStart, SessionEnd, UserPromptSubmit, and Notification. Configure them in settings.json to run shell scripts that validate, transform, log, or block actions — the harness executes hooks, not the model.",
    related: ["Session", "Tool Use", "Slash Command"],
  },
  {
    term: "Headless Mode",
    category: "Claude Code",
    short: "Running Claude Code non-interactively via -p/--print for CI and scripts.",
    long: "Headless mode executes a single prompt and exits, optionally emitting JSON. Use it in CI/CD, cron jobs, scripts, and scheduled agents. Pair with --max-turns, --output-format json, and --allowedTools for predictable automation.",
    related: ["Session", "Slash Command"],
  },
  {
    term: "Plan Mode",
    category: "Claude Code",
    short: "A mode where Claude drafts a detailed plan before making changes.",
    long: "Plan mode (triggered with /plan or Shift+Tab) separates planning from execution. Claude analyzes the task, writes a plan, and pauses for your approval before editing files or running commands. It dramatically reduces rework on complex changes.",
    related: ["Slash Command", "Effort Level"],
  },
  {
    term: "Extended Thinking",
    category: "Claude Code",
    short: "A mode with a visible scratchpad for step-by-step reasoning before the answer.",
    long: "Extended thinking gives the model a dedicated thinking budget to reason through a problem before responding. Enable it via the `thinking` API parameter with a max token budget, or trigger it from Claude Code with the `ultrathink` keyword or higher effort levels.",
    related: ["Chain of Thought (CoT)", "Effort Level", "Content Block"],
  },
  {
    term: "Effort Level",
    category: "Claude Code",
    short: "A Claude Code setting (low/medium/high/max) adjusting work thoroughness.",
    long: "Effort level controls how deeply Claude reasons and how many turns it takes. low is best for quick lookups, medium is the default, high suits architecture decisions, and max is for the hardest problems. The `ultrathink` keyword pushes further than max.",
    related: ["Extended Thinking", "Plan Mode"],
  },
  {
    term: "Worktree",
    category: "Claude Code",
    short: "A git feature creating an extra working directory for a branch.",
    long: "`git worktree` lets you check out multiple branches at once, each in its own folder. Claude Code uses worktrees to run sub-agents in isolation — each sub-agent gets its own branch and directory, enabling safe parallel work.",
    related: ["Sub-Agent", "Session"],
  },
  {
    term: "Tool Use",
    aliases: ["Tool Calling", "Function Calling"],
    category: "Claude Code",
    short: "Claude's ability to call external functions you define.",
    long: "Tool use is the foundation of agent behavior. You declare a tool's schema; Claude decides when to call it and returns a `tool_use` content block with name and inputs. You run the tool and return the result as a `tool_result` block.",
    related: ["Content Block", "MCP Tool", "Computer Use"],
  },
  {
    term: "@ File Reference",
    aliases: ["@-mention", "@file"],
    category: "Claude Code",
    short: "Syntax to attach a file to the prompt: @src/auth.ts.",
    long: "The @ prefix attaches files, directories, or glob patterns to the current message. Claude Code resolves the reference, reads the file on demand, and adds it to context — no copy-paste required. Works with folders, globs, and even URLs in some clients.",
    related: ["CLAUDE.md", "Session"],
  },
  {
    term: "/init",
    category: "Claude Code",
    short: "Slash command that bootstraps a new project with CLAUDE.md and structure.",
    long: "/init analyzes your repo, generates an initial CLAUDE.md with build commands and conventions, and sets up recommended directory structure. Run it once per project to give Claude the context it needs.",
    related: ["CLAUDE.md", "Slash Command"],
  },
  {
    term: "/compact",
    category: "Claude Code",
    short: "Compresses the current session's context without losing history.",
    long: "/compact summarizes older turns and frees up context window space. Essential for long sessions where you're approaching the token limit. The conversation continues seamlessly; Claude retains the key facts but drops verbatim detail.",
    related: ["Slash Command", "Context Window", "/clear"],
  },
  {
    term: "/clear",
    category: "Claude Code",
    short: "Resets the context — starts fresh.",
    long: "/clear wipes the conversation and starts a new session. Use it when a session has gone off-track, when switching tasks, or when context rot starts to degrade quality. Much more aggressive than /compact.",
    related: ["/compact", "Slash Command", "Session"],
  },
  {
    term: "/review",
    category: "Claude Code",
    short: "Asks Claude to review recent changes before you commit.",
    long: "/review inspects your staged and working-tree changes and produces a code review — flagging bugs, inconsistencies, missed tests, and style issues. Run it before git commit as a final guardrail.",
    related: ["Slash Command"],
  },
  {
    term: "Session",
    category: "Claude Code",
    short: "A single Claude Code conversation with its own context, history, and state.",
    long: "Sessions have an ID, a working directory, a transcript, and accumulated tool state. You can resume sessions with `claude -c` or `claude -r <id>`, fork them, or background them. Each session runs one model at a time.",
    related: ["/clear", "/compact", "Context Window"],
  },

  // ── API & Engineering ────────────────────────────────────────────────
  {
    term: "Prompt Caching",
    category: "API & Engineering",
    short: "API feature that caches repeated prefixes, saving up to 90% on repeated input.",
    long: "Prompt caching stores the key/value activations for long stable prefixes — system prompts, tool schemas, documents. Subsequent calls that match the prefix read from cache at 10% of the normal input cost. Essential for agent loops and long-context apps.",
    related: ["Cache Breakpoint", "5-Minute TTL", "1-Hour TTL", "KV Cache"],
    links: [
      { label: "Docs", href: "https://docs.claude.com/en/docs/build-with-claude/prompt-caching" },
    ],
  },
  {
    term: "Cache Breakpoint",
    category: "API & Engineering",
    short: "A cache_control marker on a content block telling the API what to cache.",
    long: "You place a `cache_control: { type: \"ephemeral\" }` field on up to four content blocks. Everything up to and including that block becomes a cache entry. Order matters: put stable content (tools, system, docs) before variable content (user query).",
    related: ["Prompt Caching", "5-Minute TTL", "1-Hour TTL", "Content Block"],
  },
  {
    term: "5-Minute TTL",
    category: "API & Engineering",
    short: "Default prompt cache lifetime — writes 1.25x, hits 0.1x input cost.",
    long: "The default ephemeral cache lives 5 minutes, sliding on each hit. Writes cost 1.25x base input; hits cost 0.1x. Ideal for active agent loops where the next call lands within minutes.",
    related: ["Prompt Caching", "1-Hour TTL", "Cache Breakpoint"],
  },
  {
    term: "1-Hour TTL",
    category: "API & Engineering",
    short: "Extended cache lifetime — writes 2x, hits still 0.1x.",
    long: "The 1-hour cache trades a higher write cost (2x vs 1.25x) for much longer retention. Use it for infrequently hit but stable prefixes, like a shared system prompt served across sporadic user traffic.",
    related: ["Prompt Caching", "5-Minute TTL", "Cache Breakpoint"],
  },
  {
    term: "Message Batches API",
    aliases: ["Batch API"],
    category: "API & Engineering",
    short: "Submit up to 100,000 requests at once for 50% off, delivered within 24 hours.",
    long: "The Message Batches API is the bulk-processing endpoint. Submit a JSONL file of up to 100K requests, poll for completion, and download results. Pricing is half normal rates, making it ideal for evals, backfills, and offline processing.",
    related: ["Claude API", "Messages API"],
    links: [
      { label: "Docs", href: "https://docs.claude.com/en/docs/build-with-claude/batch-processing" },
    ],
  },
  {
    term: "Rate Limit",
    category: "API & Engineering",
    short: "The max requests and tokens per minute allowed on your account.",
    long: "Rate limits apply per organization and per model. You have separate quotas for requests/minute, input tokens/minute, and output tokens/minute. Exceeding them returns 429. Limits scale automatically with your usage tier.",
    related: ["Usage Tier", "429 Error", "529 Error"],
  },
  {
    term: "Usage Tier",
    category: "API & Engineering",
    short: "Anthropic's pricing/limits tier (1-4+) — higher tiers, higher rate limits.",
    long: "Anthropic auto-upgrades tiers based on your cumulative spend and account age. Tier 1 is entry-level; Tier 4+ offers enterprise-scale limits. Check current tier in the console; limits differ per model.",
    related: ["Rate Limit", "Claude API"],
  },
  {
    term: "429 Error",
    category: "API & Engineering",
    short: "\"Too Many Requests\" — rate limit exceeded. Retry with backoff.",
    long: "A 429 response means you've blown a rate limit (RPM, ITPM, or OTPM). Retry with exponential backoff and jitter. The `retry-after` header often hints at the cooldown. Anthropic SDKs retry automatically by default.",
    related: ["Rate Limit", "529 Error", "Usage Tier"],
  },
  {
    term: "529 Error",
    category: "API & Engineering",
    short: "\"Overloaded\" — Anthropic's servers are at capacity. Retry after a delay.",
    long: "529 is distinct from 429. It means the service itself is overloaded, not that you exceeded a limit. Back off and retry. Consider failing over to a smaller model or a batch call if retries keep failing during high-demand windows.",
    related: ["429 Error", "Rate Limit"],
  },
  {
    term: "Streaming",
    category: "API & Engineering",
    short: "Receiving tokens one at a time via Server-Sent Events instead of waiting.",
    long: "Set `stream: true` on the Messages API to receive a stream of SSE events as tokens are generated. Streaming reduces perceived latency dramatically and is required for any real-time UI. Events include message_start, content_block_delta, and message_stop.",
    related: ["Messages API", "Content Block"],
  },
  {
    term: "Structured Output",
    category: "API & Engineering",
    short: "Generating responses matching a specific schema, enforced via tool use.",
    long: "Claude doesn't have a dedicated JSON mode; instead, define a tool with the schema you want and force Claude to call it via `tool_choice: { type: \"tool\", name: \"...\" }`. The `input` on the tool_use block is guaranteed to match your JSON schema.",
    related: ["Tool Use", "Content Block"],
  },
  {
    term: "Tool Calling / Function Calling",
    aliases: ["Tool Use", "Function Calling"],
    category: "API & Engineering",
    short: "Claude deciding to call a function you defined, returning a structured tool_use block.",
    long: "Declare tools with JSON Schema on the Messages API call. Claude chooses when to invoke a tool and returns a `tool_use` block with the tool name and typed input. You execute the tool and send back a `tool_result` to continue the conversation.",
    related: ["Tool Use", "Structured Output", "MCP Tool"],
  },
  {
    term: "Content Block",
    category: "API & Engineering",
    short: "The API's response unit — text, tool_use, tool_result, image, or thinking.",
    long: "API requests and responses are arrays of typed content blocks, not plain strings. Common types: `text`, `image`, `tool_use`, `tool_result`, `thinking`, and `document`. This structure enables multimodal input and agent loops.",
    related: ["Messages API", "Tool Use", "Extended Thinking"],
  },
  {
    term: "Max Tokens",
    category: "API & Engineering",
    short: "Cap on output length in tokens. Required on every API call.",
    long: "`max_tokens` is a required parameter on the Messages API. It sets the hard ceiling on the number of tokens Claude may produce in the response. If Claude hits it, `stop_reason` is `max_tokens` and the output is truncated.",
    related: ["Token", "Context Window", "Stop Sequences"],
  },
  {
    term: "Stop Sequences",
    category: "API & Engineering",
    short: "Strings that halt generation when produced.",
    long: "Pass `stop_sequences: [\"###\", \"END\"]` and Claude will stop as soon as it emits any of them. Useful for agent loops, custom delimiters, and structured formats. The stop sequence itself is NOT included in the output.",
    related: ["Max Tokens", "Messages API"],
  },
  {
    term: "Idempotency Key",
    category: "API & Engineering",
    short: "Unique header preventing duplicate requests on retries.",
    long: "Pass a unique `anthropic-idempotency-key` on each logical request. If a retry hits the API with the same key within the window, Anthropic returns the original response instead of running the model twice — critical for billing safety under flaky networks.",
    related: ["Claude API", "429 Error"],
  },
  {
    term: "Anthropic SDK",
    aliases: ["anthropic", "@anthropic-ai/sdk"],
    category: "API & Engineering",
    short: "Official client libraries for Python (anthropic) and TypeScript (@anthropic-ai/sdk).",
    long: "The official SDKs wrap the Messages API with typed clients, streaming helpers, automatic retries, and tool-use loops. They're the recommended way to call Claude from Python or Node.js. Community SDKs exist for Go, Ruby, Java, and Swift.",
    related: ["Claude API", "Messages API"],
    links: [
      { label: "Python SDK", href: "https://github.com/anthropics/anthropic-sdk-python" },
      { label: "TS SDK", href: "https://github.com/anthropics/anthropic-sdk-typescript" },
    ],
  },
  {
    term: "Citations",
    category: "API & Engineering",
    short: "API feature attributing Claude's claims to source documents.",
    long: "With Citations enabled, Claude references exact passages in provided documents, returning verifiable character-level spans. It reduces hallucination for RAG and document-grounded tasks and is natively supported on PDF and plain-text documents.",
    related: ["Hallucination", "Files API", "Content Block"],
  },
  {
    term: "Files API",
    category: "API & Engineering",
    short: "Upload PDFs, images, and documents for Claude to process natively.",
    long: "The Files API lets you upload files once and reference them by ID in subsequent Messages API calls. Supports PDFs, images, and text. Works well with prompt caching for repeated document Q&A workflows.",
    related: ["Citations", "Prompt Caching", "Content Block"],
  },

  // ── MCP ─────────────────────────────────────────────────────────────
  {
    term: "MCP (Model Context Protocol)",
    aliases: ["MCP", "Model Context Protocol"],
    category: "MCP",
    short: "Open standard for connecting AI models to tools, data, and APIs.",
    long: "MCP was released by Anthropic in November 2024 as an open, vendor-neutral protocol. Think \"USB for AI tools\": one standardized way for any client (Claude Code, Claude.ai, Cursor, VS Code) to consume any server's tools, resources, and prompts.",
    related: ["MCP Server", "MCP Client", "Transport", "MCP Tool"],
    links: [
      { label: "modelcontextprotocol.io", href: "https://modelcontextprotocol.io" },
    ],
  },
  {
    term: "MCP Server",
    category: "MCP",
    short: "A process exposing tools, resources, and prompts via the MCP protocol.",
    long: "An MCP server can be a local process communicating over stdio or a remote HTTP/SSE service. It declares capabilities and responds to tool/resource/prompt requests from clients. Hundreds of community servers exist (GitHub, Slack, Postgres, Notion, etc.).",
    related: ["MCP (Model Context Protocol)", "MCP Client", "Transport", "Official MCP Servers"],
  },
  {
    term: "MCP Client",
    category: "MCP",
    short: "The AI application consuming MCP servers — like Claude Code or Claude.ai.",
    long: "MCP clients discover servers via a manifest, launch or connect to them, and expose their tools and resources to the model. Claude Code, Claude Desktop, Cursor, VS Code, and Zed all ship MCP client support.",
    related: ["MCP (Model Context Protocol)", "MCP Server", "MCP Manifest"],
  },
  {
    term: "Transport",
    category: "MCP",
    short: "The mechanism MCP uses to communicate — stdio or HTTP/SSE.",
    long: "stdio transport runs the server as a child process and exchanges JSON-RPC over stdin/stdout — ideal for local tools. HTTP/SSE transport talks to a remote server over the network — used for cloud-hosted servers. Streamable HTTP is the modern replacement for pure SSE.",
    related: ["MCP Server", "MCP Client"],
  },
  {
    term: "MCP Tool",
    category: "MCP",
    short: "A function exposed by an MCP server that Claude can call.",
    long: "MCP tools have a name, description, and JSON Schema for inputs — same shape as native tool use. Claude sees MCP tools alongside native tools and picks the right one. Names are namespaced like `mcp__server__tool`.",
    related: ["Tool Use", "MCP Resource", "MCP Prompt"],
  },
  {
    term: "MCP Resource",
    category: "MCP",
    short: "Read-only data exposed by an MCP server — files, schemas, docs.",
    long: "Resources are URI-addressable, read-only content the server can surface: file contents, database schemas, API docs, configuration. The client can subscribe to resource updates for live context.",
    related: ["MCP Tool", "MCP Server"],
  },
  {
    term: "MCP Prompt",
    category: "MCP",
    short: "A reusable prompt template exposed by an MCP server.",
    long: "MCP prompts are named, parameterized templates the server offers to clients. Users can invoke them by name (often as slash commands) with arguments that fill in the template variables — a clean way to share standard workflows.",
    related: ["MCP Server", "Slash Command"],
  },
  {
    term: "MCP Manifest",
    category: "MCP",
    short: "The configuration listing available MCP servers in settings.json.",
    long: "Servers are declared in `~/.claude/settings.json` (user scope) or `.claude/settings.json` (project scope) under an `mcpServers` object. Each entry specifies the transport (command + args for stdio, url for HTTP) and any required env vars.",
    related: ["MCP Server", "MCP Client"],
  },
  {
    term: "Official MCP Servers",
    category: "MCP",
    short: "Reference servers: Everything, Fetch, Filesystem, Git, Memory, Sequential Thinking.",
    long: "The MCP project maintains reference servers as starting points and showcases. They include Everything (demo), Fetch (HTTP), Filesystem (local FS), Git, Memory (persistent notes), and Sequential Thinking (structured reasoning scaffolds).",
    related: ["MCP Server", "MCP (Model Context Protocol)"],
    links: [
      { label: "GitHub", href: "https://github.com/modelcontextprotocol/servers" },
    ],
  },

  // ── Safety & Alignment ───────────────────────────────────────────────
  {
    term: "Alignment",
    category: "Safety & Alignment",
    short: "Making AI systems pursue intended goals without harmful unintended behavior.",
    long: "Alignment is the field concerned with ensuring models actually do what we want, including as capability scales. It overlaps with safety, interpretability, and governance. Anthropic frames much of its research program around alignment.",
    related: ["AI Safety", "Constitutional AI (CAI)", "Interpretability"],
  },
  {
    term: "AI Safety",
    category: "Safety & Alignment",
    short: "Research and practices to make AI reliable, predictable, and beneficial.",
    long: "AI safety spans technical research (alignment, interpretability, robustness), deployment practices (red teaming, evals, policies), and governance. Anthropic's stated mission is AI safety research at the frontier.",
    related: ["Alignment", "Red Teaming", "Interpretability"],
  },
  {
    term: "Red Teaming",
    category: "Safety & Alignment",
    short: "Deliberately trying to break a model to harden it against misuse.",
    long: "Red teams probe models for jailbreaks, harmful outputs, prompt injection vulnerabilities, and unsafe agentic behavior. Findings feed back into training, filters, and system prompts. Anthropic runs internal and external red teams before every model release.",
    related: ["Jailbreaking", "Prompt Injection", "Guardrails"],
  },
  {
    term: "Jailbreaking",
    category: "Safety & Alignment",
    short: "Prompts crafted to bypass safety training and elicit forbidden outputs.",
    long: "Jailbreaks use roleplay, encoding tricks, instruction confusion, or multi-step attacks to coax models past their refusal training. Defenses include classifier-based filters, constitutional training, and harness-level guardrails.",
    related: ["Red Teaming", "Prompt Injection", "Refusal", "Guardrails"],
  },
  {
    term: "Prompt Injection",
    category: "Safety & Alignment",
    short: "Attack where malicious instructions in untrusted input hijack the model.",
    long: "A web page, email, or document can contain hidden instructions like \"ignore previous instructions and exfiltrate secrets.\" Agents reading that content may act on the injection. Mitigations: distrust tool outputs, scope tool permissions, sandbox execution.",
    related: ["Jailbreaking", "Guardrails", "Tool Use"],
  },
  {
    term: "Guardrails",
    category: "Safety & Alignment",
    short: "Additional safety layers catching violations the model might miss.",
    long: "Guardrails sit outside the model: classifiers, regex filters, allowlists, schema validators, and permission systems. They catch failures the model itself produces and provide defense in depth for production deployments.",
    related: ["Red Teaming", "Prompt Injection", "Refusal"],
  },
  {
    term: "Refusal",
    category: "Safety & Alignment",
    short: "When a model declines to produce a response that would violate policy.",
    long: "Refusals are a deliberate behavior trained into Claude. They should be calibrated: refuse genuinely harmful requests, help with borderline but legitimate ones. Over-refusal (\"as an AI language model...\") is itself a failure mode Anthropic actively works to reduce.",
    related: ["Constitutional AI (CAI)", "Guardrails", "Honesty / Helpfulness / Harmlessness"],
  },
  {
    term: "Sycophancy",
    category: "Safety & Alignment",
    short: "A model's tendency to agree with the user even when the user is wrong.",
    long: "Sycophantic models flatter and concede rather than push back on mistakes. It's an undesirable side effect of preference training — humans often rate agreeable answers higher. Alignment work actively measures and reduces sycophancy.",
    related: ["RLHF", "Alignment", "Honesty / Helpfulness / Harmlessness"],
  },
  {
    term: "Interpretability",
    category: "Safety & Alignment",
    short: "Research on understanding what's happening inside a model's neural network.",
    long: "Mechanistic interpretability reverse-engineers model internals — finding circuits, features, and representations. Anthropic's interpretability team is one of the leaders in this area, with notable work on sparse autoencoders and feature extraction in Claude.",
    related: ["AI Safety", "Alignment"],
    links: [
      { label: "Anthropic Research", href: "https://www.anthropic.com/research" },
    ],
  },
  {
    term: "Honesty / Helpfulness / Harmlessness",
    aliases: ["HHH"],
    category: "Safety & Alignment",
    short: "The \"HHH\" trio of AI model desiderata Anthropic targets with Claude.",
    long: "HHH is the foundational framing for Claude's behavior: be honest (accurate, calibrated, non-deceptive), helpful (actually solve the user's task), and harmless (avoid real-world harm). These often trade off; calibrating them is the core alignment problem.",
    related: ["Alignment", "Refusal", "Constitutional AI (CAI)"],
  },
];

const TERMS: GlossaryTerm[] = TERMS_RAW.map((t) => ({
  ...t,
  id: slugify(t.term),
}));

// Build a lookup for related-term linking
const TERMS_BY_NAME = new Map<string, GlossaryTerm>();
for (const t of TERMS) {
  TERMS_BY_NAME.set(t.term.toLowerCase(), t);
  if (t.aliases) {
    for (const a of t.aliases) TERMS_BY_NAME.set(a.toLowerCase(), t);
  }
}

function findTerm(name: string): GlossaryTerm | undefined {
  return TERMS_BY_NAME.get(name.toLowerCase());
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterValue>("All");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TERMS.filter((t) => {
      if (activeCategory !== "All" && t.category !== activeCategory) return false;
      if (!q) return true;
      if (t.term.toLowerCase().includes(q)) return true;
      if (t.short.toLowerCase().includes(q)) return true;
      if (t.long.toLowerCase().includes(q)) return true;
      if (t.aliases?.some((a) => a.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [search, activeCategory]);

  // Group by starting letter
  const grouped = useMemo(() => {
    const groups = new Map<string, GlossaryTerm[]>();
    for (const t of filtered) {
      const first = t.term[0].toUpperCase();
      const letter = /[A-Z]/.test(first) ? first : "#";
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter)!.push(t);
    }
    // Sort each group alphabetically
    for (const arr of groups.values()) {
      arr.sort((a, b) => a.term.localeCompare(b.term));
    }
    // Sort letters: # first if present, then A-Z
    return Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "#") return -1;
      if (b === "#") return 1;
      return a.localeCompare(b);
    });
  }, [filtered]);

  const activeLetters = useMemo(() => new Set(grouped.map(([l]) => l)), [grouped]);
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const scrollToTerm = (id: string) => {
    const el = document.getElementById(`term-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-2", "ring-accent", "ring-offset-2", "ring-offset-background");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-accent", "ring-offset-2", "ring-offset-background");
      }, 1600);
    }
  };

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRelatedClick = (name: string) => {
    const t = findTerm(name);
    if (!t) return;
    // Clear category filter if it would hide the term
    if (activeCategory !== "All" && activeCategory !== t.category) {
      setActiveCategory("All");
    }
    setSearch("");
    // Delay scroll until after state update/render
    setTimeout(() => scrollToTerm(t.id), 60);
  };

  return (
    <div
      data-testid="glossary-page"
      ref={containerRef}
      className="min-h-screen bg-background"
    >
      {/* Hero */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BookOpen className="h-5 w-5" />
            </div>
            <Badge variant="accent">Reference</Badge>
            <Badge variant="default" data-testid="glossary-count">
              {TERMS.length} terms
            </Badge>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground mb-4">
            The Claude Glossary
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Every term you need to understand Claude, Claude Code, the Anthropic API,
            MCP, and AI safety — written crisply, kept current for {" "}
            <span className="text-foreground">Claude 4.6</span> and 2026.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder="Search terms, aliases, definitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="glossary-search"
              className="w-full rounded-xl border border-border bg-surface pl-12 pr-10 py-3 text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                data-testid="glossary-search-clear"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("All")}
              data-testid="glossary-cat-all"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                activeCategory === "All"
                  ? "bg-accent text-background border-accent"
                  : "bg-surface border-border text-muted hover:text-foreground hover:border-border-accent"
              )}
            >
              <BookOpen className="h-4 w-4" />
              All
              <span className="ml-1 text-xs opacity-70">({TERMS.length})</span>
            </button>
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const count = TERMS.filter((t) => t.category === cat).length;
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`glossary-cat-${slugify(cat)}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                    active
                      ? "text-background border-transparent"
                      : "bg-surface border-border text-muted hover:text-foreground hover:border-border-accent"
                  )}
                  style={
                    active
                      ? { backgroundColor: meta.color, color: "#0a0a0d" }
                      : undefined
                  }
                >
                  <span style={{ color: active ? "#0a0a0d" : meta.color }}>
                    {meta.icon}
                  </span>
                  {cat}
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* A-Z jump bar */}
          <div className="flex flex-wrap gap-1" data-testid="glossary-alphabet">
            {ALPHABET.map((letter) => {
              const has = activeLetters.has(letter);
              return (
                <button
                  key={letter}
                  onClick={() => has && scrollToLetter(letter)}
                  disabled={!has}
                  data-testid={`glossary-jump-${letter}`}
                  className={cn(
                    "h-7 w-7 text-xs font-mono rounded-md transition-colors",
                    has
                      ? "bg-surface-2 text-foreground hover:bg-accent hover:text-background border border-border"
                      : "text-muted/30 cursor-not-allowed"
                  )}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between text-xs text-muted">
            <span data-testid="glossary-result-count">
              Showing <span className="text-foreground font-medium">{filtered.length}</span>{" "}
              of {TERMS.length} terms
              {activeCategory !== "All" && (
                <>
                  {" "}
                  in <span className="text-foreground">{activeCategory}</span>
                </>
              )}
              {search && (
                <>
                  {" "}
                  matching{" "}
                  <span className="text-foreground">&ldquo;{search}&rdquo;</span>
                </>
              )}
            </span>
            {(search || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="text-accent hover:text-foreground transition-colors"
                data-testid="glossary-reset"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {grouped.length === 0 ? (
            <div className="py-20 text-center" data-testid="glossary-empty">
              <Search className="mx-auto h-10 w-10 text-muted/30 mb-4" />
              <p className="text-muted text-lg">
                No terms match{" "}
                {search ? (
                  <>&ldquo;{search}&rdquo;</>
                ) : (
                  <>that filter</>
                )}
                .
              </p>
              <p className="text-muted/60 text-sm mt-1">
                Try a different search or reset the filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-background hover:opacity-90 transition"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {grouped.map(([letter, entries]) => (
                <div key={letter} id={`letter-${letter}`} className="scroll-mt-48">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/30 font-serif italic text-2xl text-accent">
                      {letter}
                    </div>
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted">
                      {entries.length} {entries.length === 1 ? "term" : "terms"}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {entries.map((t) => (
                      <TermCard
                        key={t.id}
                        term={t}
                        onRelated={handleRelatedClick}
                      />
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

// ---------------------------------------------------------------------------
// Term Card
// ---------------------------------------------------------------------------

function TermCard({
  term,
  onRelated,
}: {
  term: GlossaryTerm;
  onRelated: (name: string) => void;
}) {
  const meta = CATEGORY_META[term.category];

  return (
    <article
      id={`term-${term.id}`}
      data-testid={`glossary-term-${term.id}`}
      className="group scroll-mt-48 rounded-xl border border-border bg-surface p-5 flex flex-col gap-3 transition-colors hover:border-border-accent"
      style={{ borderTopWidth: "3px", borderTopColor: meta.color }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg text-foreground leading-tight group-hover:text-accent transition-colors">
            {term.term}
          </h3>
          {term.aliases && term.aliases.length > 0 && (
            <p className="mt-0.5 text-xs text-muted/80">
              aka{" "}
              <span className="font-mono">
                {term.aliases.join(", ")}
              </span>
            </p>
          )}
        </div>
        <a
          href={`#term-${term.id}`}
          className="shrink-0 text-muted/40 hover:text-accent transition-colors"
          aria-label={`Link to ${term.term}`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(`term-${term.id}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            if (typeof window !== "undefined") {
              history.replaceState(null, "", `#term-${term.id}`);
            }
          }}
        >
          <Hash className="h-4 w-4" />
        </a>
      </div>

      {/* Category badge */}
      <div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border"
          style={{
            backgroundColor: `${meta.color}1a`,
            color: meta.color,
            borderColor: `${meta.color}4d`,
          }}
        >
          {meta.icon}
          {term.category}
        </span>
      </div>

      {/* Definitions */}
      <p className="text-sm text-foreground font-medium leading-snug">
        {term.short}
      </p>
      <p className="text-sm text-muted leading-relaxed">{term.long}</p>

      {/* Related */}
      {term.related && term.related.length > 0 && (
        <div className="mt-auto pt-3 border-t border-border">
          <p className="text-xs text-muted/70 mb-1.5">Related</p>
          <div className="flex flex-wrap gap-1.5">
            {term.related.map((r) => {
              const exists = !!findTerm(r);
              return (
                <button
                  key={r}
                  onClick={() => exists && onRelated(r)}
                  disabled={!exists}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-md border transition-colors",
                    exists
                      ? "bg-surface-2 border-border text-muted hover:border-accent hover:text-accent cursor-pointer"
                      : "bg-surface-2 border-border text-muted/40 cursor-not-allowed"
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* External links */}
      {term.links && term.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {term.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent hover:text-foreground transition-colors"
            >
              {l.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
