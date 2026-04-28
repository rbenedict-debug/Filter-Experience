# Assets specs

Per-feature behavior specs owned by the **Assets** engineering team.

## What this team is delivering

The Assets handoff is **just the new filter modal integration** on four list pages.
All four pages are already in production with their own table chrome, custom views,
and data layer — engineering integrates the new filter modal and the applied filters
bar into them.

The Save View button on Assets pages uses the **existing production custom-views
feature** — that flow is not part of this handoff. Engineering hooks the new filter
state into the existing custom-view payload using whatever pattern the production
custom-views infrastructure already supports.

## Specs in this folder

- `specs-asset-views.md` — the canonical Assets page (read first)
- `specs-by-locations.md` — Assets by Locations (needs new context + groups in the engine)
- `specs-by-users.md` — Assets by Users (needs new context + groups)
- `specs-by-purchase-order.md` — Assets by Purchase Order (needs new context + groups)

The `overview`, `actions`, and `standard-views` pages are **out of scope** for this
handoff — they don't have filter integration in the prototype.

## Required reading

1. `CLAUDE.md` — project rules and Angular conventions
2. `.claude/specs/shared/specs-filter-engine.md` — the entire filter modal
3. `.claude/specs/assets/specs-asset-views.md` — the canonical per-page reference
4. The per-page spec for whichever page you're working on
