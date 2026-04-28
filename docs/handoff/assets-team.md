# Assets team — handoff

## What you're delivering

You're integrating the **new filter modal and updated toolbar** into the existing
production Assets pages. The pages themselves are already in production — you are
**not** rebuilding them. You're adding four pieces:

1. Wiring the filter button to the filter modal (per-page filter context)
2. The applied filters bar below the toolbar (markup is already in the prototype)
3. The Save View button — which extends the **existing custom-views feature** (see below)
4. Backend extensions to the custom-view payload to carry filter state

In scope: **4 pages.** The other Assets pages (`overview`, `actions`, `standard-views`)
are unchanged.

| Page | Route | What's new |
|---|---|---|
| Asset Views | `/assets/asset-views` | New filter shell, updated toolbar, applied bar, Save View → custom view |
| By Locations | `/assets/by-locations` | New filter context + shell, updated toolbar, applied bar, Save View → custom view |
| By Users | `/assets/by-users` | New filter context + shell, updated toolbar, applied bar, Save View → custom view |
| By Purchase Order | `/assets/by-purchase-order` | New filter context + shell, updated toolbar, applied bar, Save View → custom view |

## Save View on Assets is different from Tickets/Analytics

Tickets and Analytics use **saved views** — their own routed entities listed in
the subnav. Assets uses **custom views**, an **existing production feature** that
lives on the Asset Views page (selectable via a custom-view selector above the table).

**For Assets, Save View = create a new custom view on Asset Views**, not a subnav entry.
The work in this handoff is extending the existing custom-view payload to also carry
the filter state from the new filter modal.

The custom-views API exists in production. Engineering's job:

1. Extend the custom-view payload to include a `filterState` field (opaque blob from
   `filterModalGetState()`)
2. When the user opens a custom view, route to the source page and call
   `filterModalSetState()` + `filterModalApplySilent()` to re-apply the filters

## Live preview

Open Asset Views as the canonical reference:

**https://rbenedict-debug.github.io/Filter-Experience/assets/asset-views**

Try: open the filter modal, apply some filters, see the applied filters bar. The
Save View button is currently a no-op in the prototype — engineering wires it to the
existing custom-views creation flow.

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
saved-views pattern. **Assets does not use that pattern** — read it only to understand
what the other teams are doing.

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

- The existing Assets pages themselves (the table chrome, columns, row interactions, etc.)
- The Overview, Actions, and Standard Views pages (no filter integration)
- The app shell (top nav, sidebar)
- Anything under `src/app/features/{tickets,analytics,settings}`

If you find a bug or a gap that crosses into one of these, file it; don't fix it.

## Backend dependencies

| Need | Endpoint |
|---|---|
| Extend custom-view payload to include `filterState` | Existing custom-views POST/PUT endpoints |
| List custom views (existing) | Existing custom-views GET endpoint |
| Apply a custom view (existing) | Existing custom-views read endpoint, plus filter-modal `setState` + `applySilent` |
| New filter contexts (locations, users, purchase orders) | Frontend-only — define in `filter-modal-engine.js`; no backend change unless filter values come from a data source |

Coordinate with the team that owns the custom-views API early — the payload extension
is blocking for the Save View work.
