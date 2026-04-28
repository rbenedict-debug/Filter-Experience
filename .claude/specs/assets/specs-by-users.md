# By Users — assets integration

## Scope of this spec

The By Users page (`/assets/by-users`) is already in production. The handoff adds the
new filter modal integration with an updated toolbar and the applied filters bar.

The Save View button hooks into the existing custom-views feature, which is already
on production and not part of this handoff.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/assets/by-users/by-users.component.ts` |
| Template | `src/app/features/assets/by-users/by-users.component.html` |
| Filter shell | **Not yet created** — engineering builds this |

## Page identity

| | |
|---|---|
| Filter context key | `assets-users` (engineering creates) |
| Filter groups | `FILTER_GROUPS_USERS` (engineering defines) |
| Base route | `/assets/by-users` |

## Filter integration

Same as By Locations — engineering creates a filter shell for this page following the
filter-shell pattern, then mounts:

```html
<app-by-users-filter-shell
  [(open)]="filterOpen"
  (filterCountChange)="onFilterCountChange($event)"
/>
```

The user filter context is a good candidate for the **"show more" pattern** (see
the filter engine spec under "Large option lists") since user lists can be long. The
modal's existing search input handles the find-by-name case.

## Applied filters bar

Standard markup — already present.

## Required reading

1. `.claude/specs/shared/specs-filter-engine.md`
2. `.claude/specs/assets/specs-asset-views.md` — same-pattern reference page
