# Analytics team — handoff

You own the **Analytics** feature area: every dashboard under `/analytics`.

## Scope

Code: `src/app/features/analytics/`

| Dashboard | Route | Component |
|---|---|---|
| Service Overview | `/analytics/service-overview` | `service-overview/service-overview.component.ts` |
| Call Center | `/analytics/call-center` | `call-center/call-center.component.ts` |
| Chatbot | `/analytics/chatbot` | `chatbot/chatbot.component.ts` |
| Custom Reports | `/analytics/custom-reports` | `custom-reports/custom-reports.component.ts` |
| Fees | `/analytics/fees` | `fees/fees.component.ts` |
| Comparison · Users | `/analytics/comparison/users` | `comparison/users/comparison-users.component.ts` |
| Comparison · Categories | `/analytics/comparison/categories` | `comparison/categories/comparison-categories.component.ts` |
| Comparison · Topics | `/analytics/comparison/topics` | `comparison/topics/comparison-topics.component.ts` |

Cross-page modals you also own: `src/app/features/analytics/shared/` (notify users, save view, share dashboard).

## Live preview

Open Service Overview as your reference dashboard:

**https://rbenedict-debug.github.io/Filter-Experience/analytics/service-overview**

Service Overview is the canonical dashboard implementation — every other dashboard
follows its structure.

## Required reading — in this order

**1. Onboarding (everyone reads):**

- [`/CLAUDE.md`](../../CLAUDE.md) — project-wide rules and Angular conventions
- [`/README.md`](../../README.md) — local setup
- [`docs/handoff/README.md`](./README.md) — handoff overview

**2. Shared patterns your pages use:**

- [`.claude/specs/shared/specs-dashboard.md`](../../.claude/specs/shared/specs-dashboard.md) — **the canonical dashboard layout. Read this before touching any analytics page.**
- [`.claude/specs/shared/specs-filter-engine.md`](../../.claude/specs/shared/specs-filter-engine.md) — every dashboard has a filter shell
- [`.claude/specs/shared/specs-saved-views.md`](../../.claude/specs/shared/specs-saved-views.md) — analytics is the primary surface for saved views

**3. Per-feature specs (your team's behavior docs):**

Each dashboard has its own spec at `.claude/specs/analytics/specs-{page}.md`.
These cover charts, metric definitions, drill-downs, and any toolbar customizations
beyond the canonical pattern.

> **Status:** the per-feature specs are still being authored. Check `.claude/specs/analytics/`
> for what's available. If a dashboard doesn't have a spec yet, raise it before starting work.

## User stories

Your stories live at [`docs/user-stories/analytics.md`](../user-stories/analytics.md).
They are organized by epic (one epic per dashboard).

## How to work with this prototype using Claude Code

Run `claude` in the project root. Claude will auto-load `CLAUDE.md`, the design-system
guide, and the shared specs (including the dashboard pattern). When you start work on
a dashboard, ask Claude to also read that dashboard's spec — for example:

```
Read .claude/specs/analytics/specs-call-center.md, then implement story ANL-12.
```

## What is **not** in scope for this team

- The app shell (top nav, sidebar, agent status) — owned by platform
- The filter modal engine itself — owned by platform; you only consume it via the filter-shell pattern
- The dashboard pattern itself — owned by design; if it needs to evolve, raise it
- Anything under `src/app/features/{tickets,assets,settings}`

If you find a bug or a gap that crosses into one of these, file it; don't fix it.
