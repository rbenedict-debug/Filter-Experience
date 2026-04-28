# Custom Reports — analytics integration

## Scope of this spec

Same scope as the Service Overview spec, applied to Custom Reports.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/analytics/custom-reports/custom-reports.component.ts` |
| Template | `src/app/features/analytics/custom-reports/custom-reports.component.html` |
| Filter shell | `src/app/features/analytics/custom-reports/filter-shell/custom-reports-filter-shell.component.ts` |
| Save / Share modals | `src/app/features/analytics/shared/` |

## Page identity

| | |
|---|---|
| Filter context key | `custom-reports` |
| Saved-view `sourcePage` | `custom-reports` |
| Help URL | `https://help.onflo.com/analytics/custom-reports` |
| Base route | `/analytics/custom-reports` |
| Saved-view route | `/analytics/custom-reports/saved-views/:id` |

## Same shape as Service Overview

Standard analytics page — header (title row + last-updated meta + learn-more), dashboard
toolbar (date, filter, Save/Edit View, Download, Share), applied filters bar, scrolling
canvas. **No tabs, no stats bar.**

The page-specific concern for Custom Reports is that the canvas area lets users build
their own report layouts — that part is **already in production** and unchanged. The
filter and saved-view layer is what's new.

## Required reading

1. `.claude/specs/shared/specs-dashboard.md`
2. `.claude/specs/shared/specs-filter-engine.md`
3. `.claude/specs/shared/specs-saved-views.md`
4. `.claude/specs/analytics/specs-service-overview.md` — same-pattern reference page

## Backend dependencies

Cross-cutting analytics endpoints in `specs-saved-views.md`. The custom-report builder
itself uses existing production endpoints; engineering doesn't change the data layer
for this handoff.
