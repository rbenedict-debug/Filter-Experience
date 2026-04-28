# Fees — analytics integration

## Scope of this spec

Same scope as the Service Overview spec, applied to the Fees page.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/analytics/fees/fees.component.ts` |
| Template | `src/app/features/analytics/fees/fees.component.html` |
| Filter shell | `src/app/features/analytics/fees/filter-shell/fees-filter-shell.component.ts` |
| Save / Share modals | `src/app/features/analytics/shared/` |

## Page identity

| | |
|---|---|
| Filter context key | `fees` |
| Saved-view `sourcePage` | `fees` |
| Help URL | `https://help.onflo.com/analytics/fees` |
| Base route | `/analytics/fees` |
| Saved-view route | `/analytics/fees/saved-views/:id` |

## Same shape as Service Overview

Standard analytics page — header (title row + last-updated meta + learn-more), dashboard
toolbar (date, filter, Save/Edit View, Download, Share), applied filters bar, scrolling
canvas. No tabs, no stats bar.

The Fees filter context (`FILTER_GROUPS_FEES` in the engine) is rich — it includes a
**cost-range** field on `total-cost` plus several **text-match** fields (Fee Name, Fee
ID, Ticket Number, Transaction ID). See the Field Types section in
`specs-filter-engine.md` for how those render.

## Required reading

1. `.claude/specs/shared/specs-dashboard.md`
2. `.claude/specs/shared/specs-filter-engine.md` — pay attention to `cost-range` and
   `text-match` field types since this page uses both
3. `.claude/specs/shared/specs-saved-views.md`
4. `.claude/specs/analytics/specs-service-overview.md` — canonical reference

## Backend dependencies

Cross-cutting analytics endpoints in `specs-saved-views.md`. The fees data sources
are in production already.
