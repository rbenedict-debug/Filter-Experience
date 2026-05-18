# Assets team — handoff

## What you're delivering

You're integrating the **new filter modal** into the existing production Assets pages.
The pages, their tables, their data, and the custom-views feature are all already in
production. The handoff is narrow:

1. Wire the filter button to the new filter modal (per-page filter context)
2. The applied filters bar below the toolbar (markup is already in the prototype)
3. The Save View button hooks into the existing production custom-views feature —
   engineering reuses whatever pattern that already supports

In scope: **4 pages.** The Overview, Actions, and Standard Views pages are unchanged.

| Page | Route | What's new |
|---|---|---|
| Asset Views | `/assets/asset-views` | New filter shell wired in (context: `assets`, already defined) |
| By Locations | `/assets/by-locations` | New filter context + shell (engineering creates `assets-locations`) |
| By Users | `/assets/by-users` | New filter context + shell (engineering creates `assets-users`) |
| By Purchase Order | `/assets/by-purchase-order` | New filter context + shell (engineering creates `assets-purchase-orders`) |

## Live preview

Open Asset Views as the canonical reference:

**https://rbenedict-debug.github.io/Filter-Experience/assets/asset-views**

Try opening the filter modal and applying filters. The applied filters bar appears
below the toolbar.

## Required reading — in this order

**1. Onboarding (everyone reads):**

- [`/CLAUDE.md`](../../CLAUDE.md) — project-wide rules and Angular conventions
- [`/README.md`](../../README.md) — local setup
- [`docs/handoff/README.md`](./README.md) — handoff overview

**2. Shared spec (the meat of the work):**

- [`.claude/specs/shared/specs-filter-engine.md`](../../.claude/specs/shared/specs-filter-engine.md)
  — the entire filter modal. The whole engine is in scope; this is the source of truth.

**3. Assets per-page specs:**

- [`.claude/specs/assets/specs-asset-views.md`](../../.claude/specs/assets/specs-asset-views.md)
  — the canonical Assets page (read first)
- [`.claude/specs/assets/specs-by-locations.md`](../../.claude/specs/assets/specs-by-locations.md)
- [`.claude/specs/assets/specs-by-users.md`](../../.claude/specs/assets/specs-by-users.md)
- [`.claude/specs/assets/specs-by-purchase-order.md`](../../.claude/specs/assets/specs-by-purchase-order.md)

**Note:** `.claude/specs/shared/specs-saved-views.md` documents the Tickets/Analytics
saved-views pattern — Assets does not use that pattern (you use the existing custom-views
feature instead). Read it only to understand what the other teams are doing.

## User stories

Your stories live at [`docs/user-stories/assets.md`](../user-stories/assets.md).
Currently scaffolded; PM/design fills in stories per page before sprint planning.

## How to work with this prototype using Claude Code

Run `claude` in the project root. Claude auto-loads `CLAUDE.md`, the design-system
guide, and the shared filter-engine spec. Ask Claude to read the per-page spec when
you start work on a page:

```
Read .claude/specs/assets/specs-by-locations.md, then wire up the filter shell.
```

You will need to **add new filter contexts and groups** to the engine for By Locations,
By Users, and By Purchase Order — they don't exist yet. The pattern is documented in
`specs-filter-engine.md` under "Adding a new context / page".

## What is **not** in scope for this team

- The existing Assets pages themselves (table chrome, columns, row interactions, custom views)
- The Overview, Actions, and Standard Views pages
- The app shell (top nav, sidebar)
- Anything under `src/app/features/{tickets,analytics,settings}`

If you find a bug or a gap that crosses into one of these, file it; don't fix it.
