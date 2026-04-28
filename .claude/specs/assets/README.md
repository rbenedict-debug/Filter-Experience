# Assets specs

Per-feature behavior specs owned by the **Assets** engineering team.

Each feature in `src/app/features/assets/` should have a corresponding spec file here:

- `specs-overview.md`
- `specs-asset-views.md`
- `specs-standard-views.md`
- `specs-by-locations.md`
- `specs-by-purchase-order.md`
- `specs-by-users.md`
- `specs-actions.md`

A feature spec covers: list/grid behavior, column configurations, row interactions,
bulk actions, edge cases, empty states, error states, loading, and the data the page
depends on. It does **not** cover layout patterns shared across the app — those live
in `.claude/specs/shared/`.

Assets team also reads:

- `.claude/specs/shared/specs-filter-engine.md` — asset views use the filter shell
- `.claude/specs/shared/specs-saved-views.md` — saved views apply to asset views too
