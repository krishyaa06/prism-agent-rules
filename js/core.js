/* Prism Agent Rules · core logic */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Core = api;
})(typeof self !== "undefined" ? self : this, function () {
  const STACKS = {
    "Next.js": ["Use the App Router (`app/`) and React Server Components by default; add `\"use client\"` only when needed.", "Fetch data in server components or route handlers, never with useEffect for initial data.", "Use `next/image` and `next/link`."],
    React: ["Function components and hooks only.", "Keep components small; lift state only as far as needed.", "Derive values instead of syncing them with useEffect."],
    TypeScript: ["`strict` mode; never use `any` — prefer `unknown` + narrowing.", "Export explicit return types for public functions.", "Model data with types/interfaces in `types/`."],
    "Tailwind CSS": ["Style with Tailwind utility classes; avoid custom CSS unless necessary.", "Use design tokens from `tailwind.config` instead of arbitrary values."],
    "Node.js": ["Use ES modules and async/await; no callbacks.", "Validate all external input at the boundary.", "Never block the event loop with sync I/O in request paths."],
    Python: ["Follow PEP 8; type-hint all functions.", "Use `pathlib` and f-strings.", "Prefer dataclasses or pydantic models over dicts for structured data."],
    FastAPI: ["Define request/response models with pydantic.", "Use dependency injection for DB sessions and auth."],
    Supabase: ["Enable Row Level Security on every table.", "Never expose the service-role key to the client."],
    Prisma: ["Change the schema via migrations only (`prisma migrate dev`).", "Select only the fields you need."],
    Go: ["Handle every error explicitly; wrap with `fmt.Errorf(\"...: %w\", err)`.", "Keep packages small and focused; accept interfaces, return structs."],
    Rust: ["No `unwrap()` outside tests; propagate errors with `?`.", "Run `cargo clippy` clean."],
    "Discord.js": ["Use slash commands and interaction handlers.", "Keep the bot token in env vars; never log it."],
  };
  const PRINCIPLES = {
    minimal: "Make the smallest change that solves the task. Don't refactor unrelated code.",
    plan: "Before writing code, briefly list the files you'll touch and why.",
    tests: "Add or update tests for every behaviour change, and run them before finishing.",
    noPlaceholders: "Never leave TODOs, placeholder text or mock data in finished code.",
    explain: "End with a short summary of what changed and anything I need to do manually.",
    ask: "If requirements are ambiguous, ask one clarifying question instead of guessing.",
    security: "Never hardcode secrets; read them from environment variables.",
    deps: "Don't add new dependencies without asking first.",
  };
  const FORMATS = {
    cursor: { file: ".cursor/rules/project.mdc", label: "Cursor (.mdc)" },
    cursorrules: { file: ".cursorrules", label: "Legacy .cursorrules" },
    agents: { file: "AGENTS.md", label: "AGENTS.md (Codex, Jules, etc.)" },
    claude: { file: "CLAUDE.md", label: "CLAUDE.md (Claude Code)" },
    copilot: { file: ".github/copilot-instructions.md", label: "GitHub Copilot" },
    windsurf: { file: ".windsurfrules", label: "Windsurf" },
  };
  const bullets = (arr) => arr.filter(Boolean).map((x) => `- ${x}`).join("\n");
  function body(cfg) {
    const s = [];
    s.push(`# ${cfg.name || "Project"} — AI coding rules`);
    if (cfg.about) s.push(`## Project\n${cfg.about.trim()}`);
    if (cfg.stack?.length) s.push(`## Stack\n${cfg.stack.join(", ")}\n\n${bullets(cfg.stack.flatMap((t) => STACKS[t] || []))}`);
    const pr = Object.keys(PRINCIPLES).filter((k) => cfg.principles?.includes(k)).map((k) => PRINCIPLES[k]);
    if (pr.length) s.push(`## How to work\n${bullets(pr)}`);
    const style = [cfg.indent && `Indent with ${cfg.indent}.`, cfg.quotes && `Use ${cfg.quotes} quotes.`, cfg.naming && `Naming: ${cfg.naming}.`].filter(Boolean);
    if (style.length) s.push(`## Code style\n${bullets(style)}`);
    const cmds = [cfg.cmdDev && `Dev server: \`${cfg.cmdDev}\``, cfg.cmdTest && `Tests: \`${cfg.cmdTest}\``, cfg.cmdLint && `Lint/format: \`${cfg.cmdLint}\``].filter(Boolean);
    if (cmds.length) s.push(`## Commands\n${bullets(cmds)}`);
    if (cfg.structure) s.push(`## Structure\n\`\`\`\n${cfg.structure.trim()}\n\`\`\``);
    if (cfg.dont) s.push(`## Never\n${bullets(cfg.dont.split("\n").map((l) => l.replace(/^[-*]\s*/, "").trim()))}`);
    if (cfg.extra) s.push(cfg.extra.trim());
    return s.join("\n\n") + "\n";
  }
  function render(cfg, format) {
    const b = body(cfg);
    if (format === "cursor") {
      const globs = cfg.globs?.trim() || "**/*";
      return `---\ndescription: ${cfg.name || "Project"} coding rules\nglobs: ${globs}\nalwaysApply: true\n---\n\n${b}`;
    }
    return b;
  }
  return { STACKS, PRINCIPLES, FORMATS, body, render };
});
