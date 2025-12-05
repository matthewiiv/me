# Claude Code Template

A template repository with configuration files that help Claude Code write better code.

## Structure

```
.claude/
├── agents/          # Specialized subagent prompts for code review, testing, etc.
├── hooks/           # Automation scripts (e.g., run checks on stop)
├── skills/          # Domain-specific coding standards and patterns
└── settings.json    # Claude Code configuration

CLAUDE.md            # Project instructions and coding guidelines
```

## How It Works

- **CLAUDE.md** - Main instructions file that Claude reads automatically. Contains project-specific rules, architecture decisions, and coding standards.

- **Skills** - Detailed reference docs for specific domains (TypeScript patterns, AI SDK usage, design guidelines).

- **Agents** - Prompts for specialized subagents. The `code-standards-reviewer` and `architect` agents automatically run after Claude finishes making code changes to verify compliance with coding standards and review for completeness, security, and best practices.

- **Hooks** - Shell scripts that run automatically at key points (e.g., quality checks when Claude stops).

## Usage

Clone or fork this repo as a starting point, then customize the files for your project's specific needs.
