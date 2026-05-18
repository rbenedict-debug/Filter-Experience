# Comparison — Topics — analytics integration

## Scope of this spec

Same scope as the Service Overview spec, applied to the Topics comparison page.
Same shape as `specs-comparison-users.md`.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/analytics/comparison/topics/comparison-topics.component.ts` |
| Template | `src/app/features/analytics/comparison/topics/comparison-topics.component.html` |
| Filter shell | `src/app/features/analytics/comparison/topics/filter-shell/comparison-topics-filter-shell.component.ts` |
| Notify Users modal | `src/app/features/analytics/shared/notify-users-modal/` |
| Save / Share modals | `src/app/features/analytics/shared/` |

## Page identity

| | |
|---|---|
| Filter context key | `comparison-topics` |
| Saved-view `sourcePage` | `comparison-topics` |
| Help URL | `https://help.onflo.com/analytics/comparison-topics` |
| Base route | `/analytics/comparison/topics` |
| Saved-view route | `/analytics/comparison/topics/saved-views/:id` |

## Same shape as Comparison — Users

Structurally identical to `specs-comparison-users.md` — same header, stats bar,
Send Message button, and toolbar. Only the filter context key, help URL, and data
sources differ.

The topic-level cohort is what the user is comparing (e.g. password-reset tickets vs.
hardware-issue tickets). Engineering follows the same component pattern.

## Required reading

1. `.claude/specs/shared/specs-dashboard.md`
2. `.claude/specs/shared/specs-filter-engine.md`
3. `.claude/specs/shared/specs-saved-views.md`
4. `.claude/specs/analytics/specs-comparison-users.md` — same shape, more detail
5. `.claude/specs/analytics/specs-service-overview.md` — canonical reference

## Backend dependencies

| Need | Suggested endpoint |
|---|---|
| Stats bar values | `GET /api/analytics/comparison-topics/stats` |
| Send message | `POST /api/messages/notify-cohort` (same endpoint as comparison-users) |
| Dashboard data | Existing analytics API |
