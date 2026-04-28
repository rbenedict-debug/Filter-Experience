# Asset Views — assets integration

## Scope of this spec

The Asset Views page (`/assets/asset-views`) is **the hub for the Assets section**. It
is already in production. This handoff updates four pieces:

1. The **updated toolbar** (filter button, search, save view, action buttons)
2. The **filter modal** integration (this is new)
3. The **applied filters bar** below the toolbar
4. The **Save View** button — creates a **custom view** on this page (see note below)

### How Save View works on Assets pages — different from Tickets/Analytics

On Assets pages, **Save View does not create a subnav entry**. Instead, it creates a
**custom view on the Asset Views page**, which is an **existing production feature**.

Custom views are how the Assets product has always organized user-saved configurations.
The Save View button on every Assets page (Asset Views, By Locations, By Users, By
Purchase Order) feeds into the same custom-views system. Engineering integrates the
new filter state into the existing custom-view payload — no new subnav storage, no
new routes, no new "saved view" concept for Assets.

Engineering should treat this as: **"Save View on Assets = create-custom-view-on-Asset-Views (existing prod), but now the custom view also carries filter state."**

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

## Tabs

Two tabs in the page header:

| Tab | Value | Icon |
|---|---|---|
| Assets | `assets` | `devices` |
| Parts | `parts` | `build` |

Both tabs share the same filter context (`assets`) in the prototype. If product wants
distinct filtering for Parts post-handoff, engineering adds a second context
(`assets-parts`) following the pattern in `specs-filter-engine.md`.

## Toolbar

Uses `<ds-table-toolbar>` with these slots filled:

| Slot | Content |
|---|---|
| Search | `searchPlaceholder="Search assets"` (existing prod behavior) |
| Filter toggle | Bound via `[(filterActive)]="filterOpen"` — wired to the new filter shell |
| Settings toggle | Bound via `[(settingsActive)]="settingsActive"` (existing prod behavior) |
| `toolbar-actions` | **Add Asset** (filled), **Import**, **Export** (existing prod actions) |
| `toolbar-trailing` | **Save View** text button — creates a custom view |

`[showDownload]="false"` because Export already covers download.

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

Standard markup (same shape as Tickets and Analytics). Hidden when `filterCount === 0`
(via the engine's `hidden` attribute), collapsible via the toggle button.

## Save View → custom view

Click the **Save View** button. The handoff requirement:

1. Capture the current filter state via `filterModalGetState()`
2. Bundle it with the current tab (`activeTab()`), search query, and any visible
   columns/sort (the existing custom-view payload)
3. Call the existing custom-views API to create a new custom view
4. The new custom view appears on this same page (Asset Views) as a selectable view

The prototype currently has the Save View button as a no-op; engineering wires it to
the existing custom-views creation flow plus the new filter-state payload.

**Existing custom-view UI** (already in production — the prototype does not re-design it):

- The Asset Views page has a custom-view selector (likely a dropdown or chips above the
  table). Selecting a custom view re-applies its full payload, **including filter state
  going forward.**
- Custom views are stored per-user in the production backend.
- Standard Views (the cards page at `/assets/standard-views`) remains as-is — those are
  the system-defined entry points; custom views are user-defined.

## Required reading

1. `.claude/specs/shared/specs-filter-engine.md` — the full filter modal
2. The existing production docs/code for the Assets custom-views feature (engineering
   has internal access to these — they are not in this prototype)

## Backend dependencies

| Need | Endpoint |
|---|---|
| Create custom view (with filter state) | Existing custom-views POST endpoint — engineering extends payload to include `filterState` |
| List custom views | Existing custom-views GET endpoint |
| Apply a custom view | Existing custom-views read endpoint, plus `filterModalSetState()` + `filterModalApplySilent()` to re-apply filters |

The custom-views API is already in production — engineering extends the payload
schema to carry `filterState` (the opaque blob from `filterModalGetState()`).
