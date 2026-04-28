# Assets team — handoff

You own the **Assets** feature area: every page under `/assets`.

## Scope

Code: `src/app/features/assets/`

| Page | Route | Component |
|---|---|---|
| Overview | `/assets/overview` | `overview/overview.component.ts` |
| Asset Views | `/assets/asset-views` | `asset-views/asset-views.component.ts` |
| Standard Views | `/assets/standard-views` | `standard-views/standard-views.component.ts` |
| By Locations | `/assets/by-locations` | `by-locations/by-locations.component.ts` |
| By Purchase Order | `/assets/by-purchase-order` | `by-purchase-order/by-purchase-order.component.ts` |
| By Users | `/assets/by-users` | `by-users/by-users.component.ts` |
| Actions | `/assets/actions` | `actions/actions.component.ts` |

## Live preview

Open Asset Views as the canonical reference for asset list/grid behavior:

**https://rbenedict-debug.github.io/Filter-Experience/assets/asset-views**

## Required reading — in this order

**1. Onboarding (everyone reads):**

- [`/CLAUDE.md`](../../CLAUDE.md) — project-wide rules and Angular conventions
- [`/README.md`](../../README.md) — local setup
- [`docs/handoff/README.md`](./README.md) — handoff overview

**2. Shared patterns your pages use:**

- [`.claude/specs/shared/specs-filter-engine.md`](../../.claude/specs/shared/specs-filter-engine.md) — asset views and grouped views all have filter shells
- [`.claude/specs/shared/specs-saved-views.md`](../../.claude/specs/shared/specs-saved-views.md) — saved views work the same as analytics and tickets

**3. Per-feature specs (your team's behavior docs):**

Each page has its own spec at `.claude/specs/assets/specs-{page}.md`.
These cover list/grid behavior, column configurations, row interactions, bulk actions,
and the data each view depends on.

> **Status:** the per-feature specs are still being authored. Check `.claude/specs/assets/`
> for what's available. If a page doesn't have a spec yet, raise it before starting work.

## User stories

Your stories live at [`docs/user-stories/assets.md`](../user-stories/assets.md).
They are organized by epic (one epic per page).

## How to work with this prototype using Claude Code

Run `claude` in the project root. Claude will auto-load `CLAUDE.md`, the design-system
guide, and the shared specs. When you start work on a page, ask Claude to also read
that page's spec — for example:

```
Read .claude/specs/assets/specs-asset-views.md, then implement story AST-7.
```

## What is **not** in scope for this team

- The app shell (top nav, sidebar, agent status) — owned by platform
- The filter modal engine itself — owned by platform; you only consume it via the filter-shell pattern
- Anything under `src/app/features/{tickets,analytics,settings}`

If you find a bug or a gap that crosses into one of these, file it; don't fix it.
