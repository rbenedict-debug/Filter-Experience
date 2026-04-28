# By Locations — assets integration

## Scope of this spec

Same scope as the Asset Views spec: integrate the new filter modal, updated toolbar,
applied filters bar, and Save View → custom view wiring.

The page is already in production. Engineering integrates the new chrome.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/assets/by-locations/by-locations.component.ts` |
| Template | `src/app/features/assets/by-locations/by-locations.component.html` |
| Filter shell | **Not yet created** — engineering builds this following the filter-shell pattern |

## Page identity

| | |
|---|---|
| Filter context key | `assets-locations` (engineering creates this in the engine) |
| Filter groups | `FILTER_GROUPS_LOCATIONS` (engineering defines — currently does not exist) |
| Base route | `/assets/by-locations` |

## Tabs

Four location-type tabs:

| Tab | Value | Icon |
|---|---|---|
| Building | `building` | `apartment` |
| Room | `room` | `meeting_room` |
| Container | `container` | `inventory_2` |
| Special Area | `special-area` | `place` |

For v1, all four tabs share a single filter context (`assets-locations`). If product
needs per-type filtering later, split into per-tab contexts following the pattern in
`specs-filter-engine.md`.

## Toolbar

Same `<ds-table-toolbar>` shape as Asset Views. Differences:

- `[showActions]="false"` — no Add/Import/Export buttons on this page (it's a view, not
  an editor)
- `searchPlaceholder="Search locations"`
- `toolbar-trailing` slot has the **Save View** text button

## Filter integration

The prototype has the toolbar's filter button and the applied bar markup, but **no
filter shell is wired up yet**. Engineering creates `app-by-locations-filter-shell` (or
similar) following the pattern documented in `specs-filter-engine.md`, then mounts it:

```html
<app-by-locations-filter-shell
  [(open)]="filterOpen"
  (filterCountChange)="onFilterCountChange($event)"
/>
```

## Applied filters bar

Standard markup — already present in `by-locations.component.html`. Hidden when
`filterCount === 0`. Collapsible.

## Save View → custom view

Same as Asset Views: Save View creates a custom view on the Asset Views page (the
existing production feature). The custom-view payload now carries filter state plus
the active location-type tab.

When the user later opens the saved custom view, the system:

1. Routes to `/assets/by-locations` (because that's where the custom view originated)
2. Sets the active tab from the payload
3. Re-applies the filter state via `filterModalSetState()` + `filterModalApplySilent()`

Engineering owns the route-to-source-page mapping; pattern matches what the analytics
SavedViewLoader does (`SOURCE_PAGE_ROUTES` map), but it routes into the existing
custom-views infrastructure on the Assets side.

## Required reading

1. `.claude/specs/shared/specs-filter-engine.md` — patterns for adding a new context
2. `.claude/specs/assets/specs-asset-views.md` — same-pattern reference page (covers
   the Save View → custom view relationship in detail)
