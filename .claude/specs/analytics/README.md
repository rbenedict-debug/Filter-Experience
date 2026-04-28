# Analytics specs

Per-feature behavior specs owned by the **Analytics** engineering team.

Each dashboard in `src/app/features/analytics/` should have a corresponding spec file here:

- `specs-service-overview.md`
- `specs-call-center.md`
- `specs-chatbot.md`
- `specs-comparison-users.md`
- `specs-comparison-categories.md`
- `specs-comparison-topics.md`
- `specs-custom-reports.md`
- `specs-fees.md`

A feature spec covers: chart configurations, metric definitions, drill-down behavior,
toolbar customizations beyond the standard, and the data each chart depends on.
It does **not** cover the dashboard layout pattern itself — that lives in
`.claude/specs/shared/specs-dashboard.md` and applies to every dashboard.

Analytics team also reads:

- `.claude/specs/shared/specs-dashboard.md` — canonical dashboard structure (sticky header, toolbar, canvas)
- `.claude/specs/shared/specs-filter-engine.md` — every dashboard has a filter shell
- `.claude/specs/shared/specs-saved-views.md` — analytics is the primary surface for saved views
