# Comparison — Categories — analytics integration

## Scope of this spec

Same scope as the Service Overview spec, applied to the Categories comparison page.
Same shape as `specs-comparison-users.md` — comparison cohort dashboard with a stats
bar and Send Message button.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/analytics/comparison/categories/comparison-categories.component.ts` |
| Template | `src/app/features/analytics/comparison/categories/comparison-categories.component.html` |
| Filter shell | `src/app/features/analytics/comparison/categories/filter-shell/comparison-categories-filter-shell.component.ts` |
| Notify Users modal | `src/app/features/analytics/shared/notify-users-modal/` |
| Save / Share modals | `src/app/features/analytics/shared/` |

## Page identity

| | |
|---|---|
| Filter context key | `comparison-categories` |
| Saved-view `sourcePage` | `comparison-categories` |
| Help URL | `https://help.onflo.com/analytics/comparison-categories` |
| Base route | `/analytics/comparison/categories` |
| Saved-view route | `/analytics/comparison/categories/saved-views/:id` |

## Same shape as Comparison — Users

This page is **structurally identical to `specs-comparison-users.md`** — same header
layout, same stats bar pattern, same Send Message button, same toolbar. The only
differences are the filter context key, the help URL, and the data behind the stats.

The category-level cohort is what the user is comparing (e.g. categories of tickets
by department, type, etc.). Engineering follows the same component pattern; only the
data sources and filter group differ.

## Required reading

1. `.claude/specs/shared/specs-dashboard.md`
2. `.claude/specs/shared/specs-filter-engine.md`
3. `.claude/specs/shared/specs-saved-views.md`
4. `.claude/specs/analytics/specs-comparison-users.md` — same shape, more detail
5. `.claude/specs/analytics/specs-service-overview.md` — canonical reference

## Backend dependencies

| Need | Suggested endpoint |
|---|---|
| Stats bar values | `GET /api/analytics/comparison-categories/stats` |
| Send message | `POST /api/messages/notify-cohort` (same endpoint as comparison-users) |
| Dashboard data | Existing analytics API |
