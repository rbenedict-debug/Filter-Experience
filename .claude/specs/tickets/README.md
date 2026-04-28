# Tickets specs

Per-feature behavior specs owned by the **Tickets** engineering team.

Each feature in `src/app/features/tickets/` should have a corresponding spec file here:

- `specs-inbox.md`
- `specs-bookmarks.md`
- `specs-drafts.md`
- `specs-spam.md`
- `specs-saved-view.md`

A feature spec covers: states, interactions, edge cases, empty states, error states,
loading behavior, and the data the page depends on. It does **not** cover layout
patterns shared across the app — those live in `.claude/specs/shared/`.

Tickets team also reads:

- `.claude/specs/shared/specs-filter-engine.md` — every ticket list page uses the filter shell
- `.claude/specs/shared/specs-saved-views.md` — saved views apply to ticket lists too
