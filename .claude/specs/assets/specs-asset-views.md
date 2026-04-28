# Asset Views — assets integration

## Scope of this spec

The Asset Views page (`/assets/asset-views`) is already in production. The handoff is
narrow:

1. The **filter modal** integration (this is new)
2. The **applied filters bar** below the toolbar
3. The **updated toolbar** (visual updates only)

The Save View button hooks into the existing **custom views** feature on this page,
which is already on production and handled by the existing custom-views infrastructure.
This handoff does not change how custom views work.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/assets/asset-views/asset-views.component.ts` |
| Template | `src/app/features/assets/asset-views/asset-views.component.html` |
| Filter shell | `src/app/features/assets/asset-views/filter-shell/asset-filter-shell.component.ts` |

## Page identity

| | |
|---|---|
| Filter context key | `assets` |
| Filter groups | `FILTER_GROUPS_ASSETS` in `filter-modal-engine.js` |
| Base route | `/assets/asset-views` |

## Filter integration

```html
<app-asset-filter-shell
  [(open)]="filterOpen"
  (filterCountChange)="onFilterCountChange($event)"
/>
```

The filter shell calls `window.filterModalInit('assets')` in `ngAfterViewInit`. See
`.claude/specs/shared/specs-filter-engine.md` for the full engine behavior.

## Applied filters bar

Standard markup — same shape used everywhere else (see Tickets or Analytics specs for
the exact HTML). Hidden when `filterCount === 0`. Collapsible via the toggle button.

## Required reading

1. `.claude/specs/shared/specs-filter-engine.md` — the full filter modal
