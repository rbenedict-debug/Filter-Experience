# Saved Views — How It Works

There are two separate saved view systems in this project:

- **Analytics saved views** — for dashboard/analytics pages (`SavedViewsService`)
- **Ticket saved views** — for the tickets inbox (`TicketsSavedViewsService`)

They share the same concept (user saves a named filter state that can be returned to later) but
have different data shapes and different localStorage keys.

---

## Analytics saved views

### Service

`src/app/core/services/saved-views.service.ts`

Persists to `localStorage` under the key `onflo-saved-views`. Exposes a readonly signal
(`savedViews`) so any component can reactively read the list.

```typescript
export interface SavedFilterState {
  selected:          string[];
  excludedBuckets:   string[];
  fieldDateDrafts:   Record<string, unknown>;
  costRangeDraft:    { min: number | null; max: number | null };
  numericRangeDrafts:Record<string, unknown>;
  timeRangeDrafts:   Record<string, unknown>;
  textMatchDrafts:   Record<string, unknown>;
  dateRangeDraft:    { start: string | null; end: string | null };
  datePickerMode:    string;
  context:           string;
}

export interface SavedView {
  id:          string;       // 'sv-' + timestamp base36
  name:        string;
  sourcePage:  string;       // matches SOURCE_PAGE_ROUTES key in SavedViewLoaderComponent
  filterState: SavedFilterState;
  filterCount: number;
  dateLabel:   string;
  createdAt:   string;       // ISO string
}
```

Methods: `save(view)` · `update(id, updates)` · `delete(id)` · `getById(id)`

### Saving a view — full flow

1. User applies filters, then clicks "Save View" in the toolbar.
2. Parent component opens `SaveViewModalComponent` (sets `saveViewModalOpen = true`, `saveViewModalMode = 'save'`).
3. User types a name and clicks Save.
4. Parent's `onSaveViewConfirmed(name)` handler:
   - Calls `this.filterShell.getState()` to capture the full JS engine state.
   - Calls `this.savedViewsService.save({ name, sourcePage: 'my-page', filterState, filterCount, dateLabel })`.
   - Navigates to `/analytics/my-page/saved-views/{newView.id}`.
5. The route re-enters `ngOnInit` with the new `:id` param — triggers the load flow below.

### Loading a saved view — full flow

1. `ngOnInit` subscribes to `route.paramMap`. If `:id` is present, calls `savedViewsService.getById(id)`.
2. Sets `isSavedView = true`, `currentSavedView = view`, restores `dateLabel` and `filterCount` from the view.
3. If the view is already initialized (`_viewReady`), immediately calls:
   ```typescript
   this.filterShell.setState(view.filterState as unknown as Record<string, unknown>);
   this.filterShell.applySilent();
   ```
4. If not yet ready (first load), `ngAfterViewInit` sets `_viewReady = true` and calls setState + applySilent.

`applySilent` applies the filter state to the engine and emits `filterApplied` — so `filterCount`
and `filterDateActive` update correctly — without opening the modal.

### Editing a saved view

Parent shows the modal in `'edit'` mode with `initialName` set. On confirm, calls
`savedViewsService.update(currentSavedView.id, { name, filterState, filterCount, dateLabel })`.
The route and URL do not change — the user stays on the same saved-view URL.

### Deleting a saved view

Parent calls `savedViewsService.delete(currentSavedView.id)`, then navigates to the base
page route (e.g. `/analytics/call-center`), which triggers `ngOnInit` to reset the filter state.

### SaveViewModalComponent

`src/app/features/analytics/shared/save-view-modal/save-view-modal.component.ts`

Simple modal for naming a view. Inputs: `open`, `mode: 'save' | 'edit'`, `initialName`, `filterCount`.
Outputs: `openChange`, `confirmed` (emits the name string), `deleted` (for edit-mode deletion).

### SavedViewLoaderComponent (top-level shortcut route)

`src/app/features/analytics/saved-view-loader/saved-view-loader.component.ts`

Handles `/analytics/saved-views/:id`. Looks up the view, maps `sourcePage` to a base route, and
redirects to `/analytics/{page}/saved-views/{id}`. Falls back to `/analytics` if the id is invalid.

```typescript
const SOURCE_PAGE_ROUTES: Record<string, string> = {
  'service-overview':      '/analytics/service-overview',
  'chatbot':               '/analytics/chatbot',
  'call-center':           '/analytics/call-center',
  'fees':                  '/analytics/fees',
  'custom-reports':        '/analytics/custom-reports',
  'comparison-users':      '/analytics/comparison/users',
  'comparison-categories': '/analytics/comparison/categories',
  'comparison-topics':     '/analytics/comparison/topics',
};
```

### Routing

Each analytics page has a saved-view child route:
```typescript
// In app.routes.ts — example for call-center
{
  path: 'call-center',
  children: [
    { path: '',             loadComponent: () => CallCenterComponent },
    { path: 'saved-views/:id', loadComponent: () => CallCenterComponent }, // same component, reads :id
  ]
}
```

The page component is the same for both routes — it reads the `:id` param in `ngOnInit`.

### Adding saved views to a new analytics page

1. Add a child route `saved-views/:id` under the page route in `app.routes.ts`.
2. Add the page to `SOURCE_PAGE_ROUTES` in `SavedViewLoaderComponent`.
3. In the page component:
   - Add `@ViewChild(FilterShellComponent)`.
   - Add `isSavedView`, `currentSavedView`, `saveViewModalOpen`, `saveViewModalMode`, `_viewReady`.
   - Implement `ngOnInit` (param subscription), `ngAfterViewInit` (set `_viewReady`, call setState if saved view).
   - Implement `onSave`, `onEditView`, `onSaveViewConfirmed`, `onSaveViewDeleted`.
   - Add `<app-save-view-modal>` and the Save View / Edit View buttons to the template.

Copy the pattern from `call-center.component.ts` — it is the most complete reference implementation.

---

## Ticket saved views

### Service

`src/app/core/services/tickets-saved-views.service.ts`

Persists to `localStorage` under `onflo-ticket-saved-views`. Different from analytics saved views:
- Stores `activeTab` (which inbox tab was active) and `ticketCount` instead of a full `filterState`.
- Includes a hardcoded `DEMO_VIEW` fixture (`id: 'demo-badge-view'`) that is always prepended to
  the list and cannot be deleted or updated. This is for visual reference only.
- `ticketCount` is always `0` on the frontend — the backend must populate it via:
  `GET /api/tickets/saved-views/:id/count → { count: number }`

```typescript
export interface TicketSavedView {
  id:          string;       // 'tsv-' + timestamp base36
  name:        string;
  activeTab:   'my-tickets' | 'team' | 'all' | 'closed';
  filterCount: number;
  ticketCount: number;       // always 0 on frontend; backend populates
  createdAt:   string;
}
```

Methods: `save(view)` · `update(id, updates)` · `delete(id)` · `getById(id)`
All methods guard against modifying `DEMO_VIEW` by id.

`savedViews` is a `computed()` that prepends `DEMO_VIEW` to the stored array — the subnav always
shows it at the top with its `ticketCount: 247` badge.
