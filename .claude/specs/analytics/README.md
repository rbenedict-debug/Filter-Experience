# Analytics specs

Per-feature behavior specs owned by the **Analytics** engineering team.

## What this team is delivering

For every analytics page, engineering integrates four new pieces into the existing
production dashboards:

1. The **new page header** (title row, last-updated meta, learn-more link, and tabs/stats where applicable)
2. The **new dashboard toolbar** (date select, filter, Save/Edit View, Download, Share)
3. The **applied filters bar** below the toolbar
4. **Saved-view integration** (Save → URL → load round-trip)

The chart data and underlying analytics function are already in production and
unchanged. Engineering integrates the new chrome around the existing dashboards.

## Specs in this folder

One per analytics page:

- `specs-service-overview.md` — canonical reference page (has stats bar)
- `specs-chatbot.md` — 3 tabs (Overview, Optimization, Chat Logs)
- `specs-call-center.md` — 6 tabs (4 dashboard, 2 table)
- `specs-comparison-users.md` — stats bar + Send Message (Notify Users) button
- `specs-comparison-categories.md` — same shape as comparison-users
- `specs-comparison-topics.md` — same shape as comparison-users
- `specs-custom-reports.md` — single dashboard, no tabs, no stats bar
- `specs-fees.md` — single dashboard; uses `cost-range` and `text-match` field types

The saved-view detail route (`/analytics/<page>/saved-views/:id`) is documented in
`.claude/specs/shared/specs-saved-views.md` — the route + load flow is identical
across pages.

## Required reading

In order:

1. `CLAUDE.md` — project rules and Angular conventions
2. `.claude/specs/shared/specs-dashboard.md` — canonical dashboard layout
3. `.claude/specs/shared/specs-filter-engine.md` — the entire filter modal
4. `.claude/specs/shared/specs-saved-views.md` — saved-view storage, routing, load flow
5. `.claude/specs/analytics/specs-service-overview.md` — canonical per-page reference
   (read once — other per-page specs reference back to it)
6. The per-page spec for whichever page you're working on
