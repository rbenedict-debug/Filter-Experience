# Inbox — filter, applied bar, save view, subnav

## Scope of this spec

This spec covers **only** the four pieces being handed off to engineering:

1. The **filter button** in the inbox toolbar and how it opens the filter modal
2. The **applied filters bar** that appears below the toolbar when filters are active
3. The **Save View** button in the toolbar and what happens when the user clicks it
4. The **saved views entries** in the subnav for the Tickets section

Everything else on the inbox page (the tabs, the search input, the settings panel,
the ticket table, the page shell) is **already in production** and is not part of
this handoff. Engineering should not change those.

## Where things live

| Concern | File |
|---|---|
| Inbox component | `src/app/features/tickets/inbox/inbox.component.ts` (reference) |
| Inbox template | `src/app/features/tickets/inbox/inbox.component.html` (reference) |
| Filter shell | `src/app/features/tickets/inbox/filter-shell/filter-shell.component.ts` |
| Save view modal | `src/app/features/analytics/shared/save-view-modal/` (shared with analytics) |
| Saved views service | `src/app/core/services/tickets-saved-views.service.ts` |
| Subnav | `src/app/app.component.html` (search for `'tickets'` section) |
| Saved-view detail page | `src/app/features/tickets/saved-view/saved-view.component.ts` |

## 1 — Filter button → filter modal

The filter button is the existing filter toggle inside `<ds-table-toolbar>` (production
component). The inbox does **not** render its own filter button.

**Wiring:**

| Binding | Notes |
|---|---|
| `[(filterActive)]="filterOpen"` | Two-way bound to the inbox component |
| `<app-filter-shell [(open)]="filterOpen">` | Shell mounted in the inbox template |
| Filter context key | `inbox` (passed to `filterModalInit('inbox')` in the filter shell) |
| Filter groups | `FILTER_GROUPS_INBOX` in `filter-modal-engine.js` |

For the full filter modal behavior, read `.claude/specs/shared/specs-filter-engine.md`.

## 2 — Applied filters bar

Appears below the toolbar and above the table when `filterCount > 0`. Hidden otherwise.

**HTML:**

```html
<div class="filter-applied-bar" id="filter-applied-bar"
     hidden
     [class.is-collapsed]="filterBarCollapsed()">
  <span class="ds-label ds-label--brand ds-label--pill ds-label--sm filter-bar__count-chip"
        aria-hidden="true"
        (click)="toggleFilterBar()">{{ filterCount }} active filters</span>
  <div class="filter-applied-bar__cards"
       id="filter-applied-cards"
       role="group" aria-label="Applied filters"></div>
  <button class="filter-bar__toggle" type="button"
          [attr.aria-expanded]="!filterBarCollapsed()"
          [attr.aria-label]="filterBarCollapsed() ? 'Show filters, ' + filterCount + ' active' : 'Hide filters'"
          (click)="toggleFilterBar()">
    {{ filterBarCollapsed() ? 'Show filters' : 'Hide filters' }}
    <span class="ds-icon ds-icon--sm filter-bar__toggle-arrow"
          [class.filter-bar__toggle-arrow--right]="filterBarCollapsed()"
          aria-hidden="true">arrow_drop_down</span>
  </button>
</div>
```

**Element ID `filter-applied-cards` is required.** The filter engine renders the chips
into this element directly. Do not rename.

**The `hidden` attribute is set by the filter engine, not by an Angular `[hidden]` binding.**
The engine toggles it as `filterCount` rises above 0 / falls to 0.

**States:**

| State | Trigger | What's shown |
|---|---|---|
| Hidden | `filterCount === 0` | Bar not visible (engine sets `hidden`) |
| Expanded | `filterCount > 0` and not collapsed | Chips visible; "Hide filters" button on right |
| Collapsed | User clicks "Hide filters" or the count chip | Chips hidden; `{count} active filters` chip shown; "Show filters" button on right |

**Auto-expand rule:** when `filterCount` drops to 0, set `filterBarCollapsed = false` so
that the next time a filter is added, the bar opens expanded.

**Component state:**

```typescript
filterCount        = 0;
filterBarCollapsed = signal(false);

onFilterCountChange(count: number) {
  this.filterCount = count;
  if (count === 0) this.filterBarCollapsed.set(false);
}

toggleFilterBar() { this.filterBarCollapsed.update(v => !v); }
```

## 3 — Save View button

Projected into the `<ds-table-toolbar>` `toolbar-trailing` slot:

```html
<button toolbar-trailing
        class="ds-table-toolbar__text-btn"
        type="button"
        (click)="onSaveView()">Save View</button>
```

**On click:** opens `<app-save-view-modal>` with `mode="save"`. The modal accepts a name
and emits `(confirmed)` when the user clicks Save.

**On confirm:**

```typescript
onSaveViewConfirmed(name: string) {
  const newView = this.savedViewsService.save({
    name,
    activeTab:   this.activeTab(),       // 'my-tickets' | 'team' | 'all' | 'closed'
    filterCount: this.filterCount,
    ticketCount: 0,                      // filled by backend; see notes below
  });
  this.router.navigateByUrl('/tickets/saved-views/' + newView.id);
}
```

The user navigates to the saved-view route immediately on save. That route renders
`saved-view.component.ts`, which restores the filter state (see
`.claude/specs/shared/specs-saved-views.md` for the load flow).

**`ticketCount` is always 0 from the frontend.** The backend must populate the count
asynchronously — recommended endpoint shape: `GET /api/tickets/saved-views/:id/count`
returning `{ count: number }`. Engineering wires this when the API is built.

## 4 — Saved views in the subnav

The Tickets subnav lives in `app.component.html` (search for `activeSection() === 'tickets'`).
Saved views render under a "Saved Views" `<ds-subnav-header>`.

**Required structure** (already in the prototype, don't change):

```html
<ds-subnav-header
  class="saved-views-header"
  text="Saved Views"
  icon="bookmark"
  [expanded]="ticketSavedViewsExpanded()"
  (expandedChange)="ticketSavedViewsExpanded.set($event)">

  @for (view of ticketSavedViews(); track view.id) {
    <div class="tickets-saved-view-item">
      <ds-subnav-button
        [label]="view.name"
        [selected]="ticketsNavItem() === 'saved-view-' + view.id"
        (navClick)="go('/tickets/saved-views/' + view.id)" />

      @if (view.ticketCount > 0) {
        <div class="tickets-saved-view-item__badge ds-badge-indicator ds-badge-indicator--grey"
             aria-hidden="true">
          {{ view.ticketCount > 999 ? '999+' : view.ticketCount }}
        </div>
      }
    </div>
  }

  @if (ticketSavedViews().length === 0) {
    <p class="saved-views-empty">No saved views yet</p>
  }
</ds-subnav-header>
```

**Data source:** `TicketsSavedViewsService.savedViews` (a `computed()` signal).

**Badge rules:**

- Show only when `view.ticketCount > 0`
- Cap display at `999+` when count exceeds 999
- Use `ds-badge-indicator--grey` modifier (not the brand-colored badge)

**Note about the demo view:** the service prepends a hardcoded `DEMO_VIEW`
(`id: 'demo-badge-view'`, `ticketCount: 247`) for visual reference. It cannot be
deleted or updated. Engineering should preserve this fixture or remove it explicitly
once real saved views exist; do not silently drop it during refactor.

## What engineering integrates into the production inbox

Concretely, the changes engineering applies to the existing prod inbox:

1. **Wire the existing toolbar's filter toggle** to a new `<app-filter-shell>` instance
   with `context="inbox"`
2. **Add the applied filters bar HTML** below the toolbar (markup above)
3. **Add the Save View button** to the toolbar-trailing slot
4. **Add `<app-save-view-modal>`** at the end of the inbox template
5. **Add saved views rendering** to the Tickets subnav (markup above)
6. **Add the saved-view route** (`/tickets/saved-views/:id`) and component
7. **Wire `TicketsSavedViewsService`** (in-memory in the prototype; engineering replaces
   with API calls — see "Backend" below)

## Backend

The prototype uses in-memory state and `localStorage`. Engineering replaces these with
API calls. Endpoints needed for the inbox piece (final shapes TBD with backend team):

| Need | Suggested endpoint |
|---|---|
| Save a view | `POST /api/tickets/saved-views` body `{ name, activeTab, filterState }` returns `{ id, ... }` |
| List user's saved views | `GET /api/tickets/saved-views` returns `[{ id, name, activeTab, ticketCount, ... }]` |
| Get count for one saved view | `GET /api/tickets/saved-views/:id/count` returns `{ count }` |
| Get a saved view by id | `GET /api/tickets/saved-views/:id` returns full record incl. `filterState` |
| Update a saved view | `PUT /api/tickets/saved-views/:id` |
| Delete a saved view | `DELETE /api/tickets/saved-views/:id` |

The `filterState` payload is the result of `filterModalGetState()` — opaque to the backend,
just round-tripped. See `.claude/specs/shared/specs-saved-views.md` for the schema.

## Product decisions

These decisions are settled. Engineering implements them as specified.

### Saved view limit

**No cap on the number of saved views per user.** The subnav scrolls if the list grows long.
If performance becomes an issue at scale, backend should paginate the list — but that's a
v2 problem, not a v1 constraint.

### Stale filter options in saved views

If a saved view references a filter option that no longer exists (e.g. a deleted
location, a removed user), **silently drop the missing filter** when the view is loaded.
The view re-applies with the remaining valid filters; no banner, no warning, no
broken-state UI. The backend should also clean up the stored `filterState` so subsequent
loads don't re-process the missing option.

### Subnav `ticketCount` badge updates

**Real-time updates are the target.** If real-time infrastructure (websockets / SSE) is
not ready at launch, **polling on a 60-second interval is acceptable as a fallback** while
the user is in the Tickets section. Pause polling when the browser tab is hidden
(`document.visibilityState !== 'visible'`). Engineering picks the implementation; the
product requirement is that the badge reflects current reality without requiring a manual refresh.