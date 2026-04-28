# Assets specs

Per-feature behavior specs owned by the **Assets** engineering team.

## What this team is delivering

Four pages get the new filter modal, updated toolbar, applied filters bar, and
Save View wiring. **All four pages are already in production** — engineering integrates
the new chrome and wiring; they don't rebuild the pages.

The Save View flow on Assets pages is **different** from Tickets/Analytics: it does
**not** create a subnav entry. Instead, it creates a **custom view on the Asset Views
page**, which is an existing production feature. Engineering extends the existing
custom-view payload to include the filter state.

## Specs in this folder

- `specs-asset-views.md` — the **canonical** Assets page (the hub where custom views land)
- `specs-by-locations.md` — Assets by Locations (Building/Room/Container/Special Area tabs)
- `specs-by-users.md` — Assets by Users
- `specs-by-purchase-order.md` — Assets by Purchase Order

The `overview`, `actions`, and `standard-views` pages are **out of scope** for this
handoff — they don't have filter integration in the prototype and are not changing.

## Required reading

In order:

1. `CLAUDE.md` — project rules and Angular conventions
2. `.claude/specs/shared/specs-filter-engine.md` — the entire filter modal
3. `.claude/specs/assets/specs-asset-views.md` — the canonical per-page reference
   (read this once; the other three specs reference back to it)
4. The per-page spec for whichever page you're working on

## A note on saved views vs custom views

Tickets and Analytics use **saved views** — stored as their own routed entities,
shown in the subnav. Assets uses **custom views** — an existing production concept
that lives on the Asset Views page and is selected via a custom-view selector. The
new work for Assets is teaching the existing custom-view payload to carry filter state.

`.claude/specs/shared/specs-saved-views.md` is **not** the source of truth for Assets.
It documents the Tickets/Analytics pattern. Assets engineers reference it only to
understand what the other teams are doing.
