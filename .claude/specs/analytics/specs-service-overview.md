# Service Overview — analytics integration

## Scope of this spec

This spec covers the four pieces being delivered for the Service Overview page:

1. The **new page header** (title row, last-updated meta, learn-more link, stats bar)
2. The **new dashboard toolbar** (date select, filter button, Save View, Download, Share)
3. The **applied filters bar** below the toolbar
4. **Saved-view integration** (Save → URL → load round-trip, Edit View when on a saved-view URL)

The dashboard canvas (charts and chart data) **is already in production** with the same
function as today; only the chrome around it (header + toolbar + applied bar) is new.
Engineering integrates the new chrome into the existing production page.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/analytics/service-overview/service-overview.component.ts` |
| Template | `src/app/features/analytics/service-overview/service-overview.component.html` |
| Filter shell | `src/app/features/analytics/service-overview/filter-shell/analytics-filter-shell.component.ts` |
| Save view modal | `src/app/features/analytics/shared/save-view-modal/` |
| Share modal | `src/app/features/analytics/shared/share-dashboard-modal/` |
| Saved views service | `src/app/core/services/saved-views.service.ts` |
| Saved-view loader | `src/app/features/analytics/saved-view-loader/saved-view-loader.component.ts` |
| Subnav | `src/app/app.component.html` (search for `'analytics'` section) |

## Page identity

| | |
|---|---|
| Filter context key | `service` |
| Saved-view `sourcePage` | `service-overview` |
| Help URL | `https://help.onflo.com/analytics/service-overview` |
| Base route | `/analytics/service-overview` |
| Saved-view route | `/analytics/service-overview/saved-views/:id` |

## Required reading

1. `.claude/specs/shared/specs-dashboard.md` — the canonical dashboard layout pattern
   (sticky header, toolbar, applied bar, scrolling canvas). **This is the cross-cutting
   spec for every analytics page.**
2. `.claude/specs/shared/specs-filter-engine.md` — the entire filter modal
3. `.claude/specs/shared/specs-saved-views.md` — saved-view storage, routing, load flow

This per-page spec only documents what is **specific** to Service Overview.

## Page-specific: stats bar

Service Overview has a **stats bar** in the header (between the title row and the toolbar).
It shows four KPI counts as clickable buttons.

```ts
readonly stats: OverviewStat[] = [
  { id: 'total',    count: 16390, label: 'Total Tickets' },
  { id: 'open',     count: 126,   label: 'Tickets Currently Open' },
  { id: 'critical', count: 5,     label: 'Unresolved Critical Tickets' },
  { id: 'past-due', count: 79,    label: 'Past Due Tickets' },
];
```

Each stat is a `<button>` that, when clicked, should navigate to the Tickets list
filtered by that stat's scope (the prototype has this as a `// TODO` — engineering wires
it up). The stats themselves come from the analytics API; engineering replaces the
hardcoded values with a service call.

## Date filter

Standard dashboard date select. Options (in order):

```
All Time, Current School Year, Last School Year,
Last 90 Days, Last 30 Days, This Month, Last 7 Days, This Week
```

Default label: **Last 90 Days**. Plus a **Custom Date Range...** option after a divider
that opens the calendar picker.

When the user picks a preset from the toolbar menu while a date filter is active in the
filter modal, the modal's date filter is cleared first (`window.filterModalClearDates?.()`).
This prevents the toolbar date and the filter-modal date from getting out of sync.

When `filterDateActive` is true (the filter modal has an active date filter), the date
button shows a visual override modifier:

```html
<button class="ds-dashboard-toolbar__date-select"
        [class.ds-dashboard-toolbar__date-select--overridden]="filterDateActive">
```

## Save View vs. Edit View — the toolbar's primary action

The toolbar's primary text button changes label and behavior based on whether the user
is on the base route or a saved-view route:

| Route | Button label | Click action |
|---|---|---|
| `/analytics/service-overview` | **Save View** | `onSave()` → opens save-view modal in `'save'` mode |
| `/analytics/service-overview/saved-views/:id` | **Edit View** | `onEditView()` → opens save-view modal in `'edit'` mode (with `initialName`) |

In `'edit'` mode, the modal also exposes a Delete action; deletion routes back to the
base route and resets state.

## Saved-view load flow (page-specific bits)

The shared spec (`specs-saved-views.md`) documents the route + service + apply-silent
pattern. For Service Overview specifically:

- `ngOnInit` subscribes to `route.paramMap`. When `:id` is present, looks up the view
  via `SavedViewsService.getById(id)`. Sets `isSavedView`, copies `dateLabel` and
  `filterCount` from the view, sets `filterBarCollapsed.set(true)` (saved views land collapsed).
- `ngAfterViewInit` flips `_viewReady = true` and applies the filter state via
  `filterShell.setState(view.filterState)` then `filterShell.applySilent()`.
- Subsequent `paramMap` emissions (navigating between saved views without leaving the
  component) re-apply state immediately because `_viewReady` is already true.

When transitioning **from** a saved view back to the base route, `filterShell.resetState()`
is called and `filterBarCollapsed.set(false)`.

## Subnav saved views

The analytics subnav lists saved views under a "Saved Views" `<ds-subnav-header>`
in `app.component.html`. Markup is shared across all analytics pages — see the shared
saved-views spec. No service-overview-specific subnav behavior beyond data binding to
`SavedViewsService.savedViews`.

The Service Overview saved-view route is also reachable via the top-level shortcut:

```
/analytics/saved-views/:id
```

This is handled by `SavedViewLoaderComponent`, which maps the view's `sourcePage` key
(`service-overview`) to the proper child route and redirects.

## Share dashboard modal

The Share button (rightmost in toolbar) opens `<app-share-dashboard-modal>`. This is
a shared component used by every analytics page.

```html
<app-share-dashboard-modal
  [(open)]="shareOpen"
  dashboardTitle="Service Overview"
/>
```

Engineering wires the actual share mechanism (URL copy, email, etc.) — the prototype
just shows the modal UI. See `src/app/features/analytics/shared/share-dashboard-modal/`
for the component contract.

## Download

The Download button (`onDownload()`) is a placeholder in the prototype. Engineering
implements the export — recommend CSV of the current dashboard's underlying data,
respecting active filters.

## Backend dependencies

In addition to the cross-cutting analytics endpoints documented in
`specs-saved-views.md` and `specs-filter-engine.md`:

| Need | Suggested endpoint |
|---|---|
| Stats bar counts | `GET /api/analytics/service-overview/stats` returning `[{ id, count, label }]` |
| Last-updated timestamp | Comes from the same stats response (`{ ..., generatedAt }`) |
| Stat → tickets navigation | `GET /api/tickets?scope=open` etc. — use existing tickets API with a scope param |
| Dashboard data | Existing analytics API — production code already uses it |
