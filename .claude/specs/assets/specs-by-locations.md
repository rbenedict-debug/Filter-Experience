# By Locations — assets integration

## Scope of this spec

The By Locations page (`/assets/by-locations`) is already in production. The handoff
adds the new filter modal integration to this page, with an updated toolbar and the
applied filters bar.

The Save View button hooks into the existing custom-views feature, which is already
on production and not part of this handoff.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/assets/by-locations/by-locations.component.ts` |
| Template | `src/app/features/assets/by-locations/by-locations.component.html` |
| Filter shell | **Not yet created** — engineering builds this |

## Page identity

| | |
|---|---|
| Filter context key | `assets-locations` (engineering creates this in the engine) |
| Filter groups | `FILTER_GROUPS_LOCATIONS` (engineering defines — currently does not exist) |
| Base route | `/assets/by-locations` |

## Filter integration

The prototype has the toolbar's filter button and the applied bar markup, but no
filter shell is wired up yet. Engineering creates a filter shell for this page
following the pattern in `specs-filter-engine.md`, then mounts it:

```html
<app-by-locations-filter-shell
  [(open)]="filterOpen"
  (filterCountChange)="onFilterCountChange($event)"
/>
```

A new filter context (`assets-locations`) and filter groups (`FILTER_GROUPS_LOCATIONS`)
need to be added to the engine — see "Adding a new context / page" in the filter
engine spec.

## Applied filters bar

Standard markup — already present in `by-locations.component.html`.

## Required reading

1. `.claude/specs/shared/specs-filter-engine.md` — including "Adding a new context / page"
2. `.claude/specs/assets/specs-asset-views.md` — same-pattern reference page
