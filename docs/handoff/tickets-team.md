# Tickets team — handoff

You own the **Tickets** feature area: Inbox, Bookmarks, Drafts, Spam, and Saved Views.

## Scope

Code: `src/app/features/tickets/`

| Page | Route | Component |
|---|---|---|
| Inbox | `/tickets/inbox` | `inbox/inbox.component.ts` |
| Bookmarks | `/tickets/bookmarks` | `bookmarks/bookmarks.component.ts` |
| Drafts | `/tickets/drafts` | `drafts/drafts.component.ts` |
| Spam | `/tickets/spam` | `spam/spam.component.ts` |
| Saved view | `/tickets/saved-view` | `saved-view/saved-view.component.ts` |

## Live preview

Open the inbox in the deployed prototype to see the target behavior:

**https://rbenedict-debug.github.io/Filter-Experience/tickets/inbox**

## Required reading — in this order

**1. Onboarding (everyone reads):**

- [`/CLAUDE.md`](../../CLAUDE.md) — project-wide rules and Angular conventions
- [`/README.md`](../../README.md) — local setup
- [`docs/handoff/README.md`](./README.md) — handoff overview

**2. Shared patterns your pages use:**

- [`.claude/specs/shared/specs-filter-engine.md`](../../.claude/specs/shared/specs-filter-engine.md) — how filter shells work (every list page has one)
- [`.claude/specs/shared/specs-saved-views.md`](../../.claude/specs/shared/specs-saved-views.md) — saved views work the same as analytics

**3. Per-feature specs (your team's behavior docs):**

Each page has its own spec at `.claude/specs/tickets/specs-{page}.md`.
These are the source of truth for state, edge cases, empty states, error states, and data needs.

> **Status:** the per-feature specs are still being authored. Check `.claude/specs/tickets/`
> for what's available. If a page doesn't have a spec yet, raise it before starting work.

## User stories

Your stories live at [`docs/user-stories/tickets.md`](../user-stories/tickets.md).
They are organized by epic (one epic per page).

## How to work with this prototype using Claude Code

Run `claude` in the project root. Claude will auto-load `CLAUDE.md`, the design-system
guide, and the shared specs. When you start work on a page, ask Claude to also read
that page's spec — for example:

```
Read .claude/specs/tickets/specs-inbox.md, then implement story TICK-3.
```

## What is **not** in scope for this team

- The app shell (top nav, sidebar, agent status) — owned by platform
- The filter modal engine itself — owned by platform; you only consume it via the filter-shell pattern
- Anything under `src/app/features/{analytics,assets,settings}`

If you find a bug or a gap that crosses into one of these, file it; don't fix it.
