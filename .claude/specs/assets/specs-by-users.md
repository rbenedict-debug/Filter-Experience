# By Users — assets integration

## Scope of this spec

Same scope as Asset Views and By Locations: integrate the new filter modal, updated
toolbar, applied filters bar, and Save View → custom view wiring on the existing
production page.

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

## Tabs

No tabs — single view of assets grouped by user.

## Toolbar

Same `<ds-table-toolbar>` shape as Asset Views. Differences:

- `[showActions]="false"` — no Add/Import/Export
- `searchPlaceholder="Search users"`
- `toolbar-trailing` slot has the **Save View** text button

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

## Save View → custom view

Same pattern as Asset Views — creates a custom view on the Asset Views page that
carries the filter state plus the source page identifier (`by-users`) so the
custom-view loader knows where to route when the user re-opens it.

## Required reading

1. `.claude/specs/shared/specs-filter-engine.md`
2. `.claude/specs/assets/specs-asset-views.md` — the canonical Save View → custom view flow
