# Inbox — feature spec

The Inbox is the agent's daily-driver list of tickets. It is the default landing page
of the Tickets feature.

## Route and component

| | |
|---|---|
| Route | `/tickets/inbox` |
| Component | `src/app/features/tickets/inbox/inbox.component.ts` |
| Template | `src/app/features/tickets/inbox/inbox.component.html` |
| Filter shell | `src/app/features/tickets/inbox/filter-shell/filter-shell.component.ts` |
| Filter context key | `inbox` |

## Required reading

Before implementing, read in this order:

1. `CLAUDE.md` (project rules and Angular conventions)
2. `.claude/specs/shared/specs-filter-engine.md` (the filter-shell pattern this page consumes)
3. `.claude/specs/shared/specs-saved-views.md` (saved-views storage and routing)

## Page structure

The inbox uses a list-page layout (not a dashboard layout). DOM order, top to bottom:

1. **Heading row** with tabs (no visible title — the title is screen-reader only)
2. **Table toolbar** (`<ds-table-toolbar>`) with search, custom buttons, filter toggle, settings toggle
3. **Applied filters bar** (hidden when filter count is 0)
4. **Table area** (currently a placeholder; engineering builds the real ag-grid table here)
5. **Filter shell** (the JS modal, mounted but invisible until opened)
6. **Save view modal** (mounted but invisible until opened)

## Tabs

Four tabs in fixed order. The active tab is held in a signal: `activeTab()`.

| Tab | Value | Badge |
|---|---|---|
| My Tickets | `my-tickets` | `12` (numeric) |
| Team | `team` | `99+` (cap shown when count exceeds 99) |
| All | `all` | none |
| Closed | `closed` | none |

**Behavior:**

- The default selected tab on first load is **My Tickets**
- Switching tabs updates `activeTab()` only; it does **not** clear active filters or the saved-view dirty state
- Each tab represents a different server-side ticket query; the filter shell layers on top
- Badge counts come from the tickets API (count of unread / unassigned per scope) — wire when API is available
- Badge cap rule: show the integer when ≤ 99, show `99+` when > 99
- Aria: `role="tab"`, `aria-selected`, and `tabindex="0"` only on the active tab; inactive tabs use `tabindex="-1"`

## Toolbar

Uses the design system `<ds-table-toolbar>` component with these inputs:

- `[showActions]="false"` (no add/edit/delete buttons in the inbox)
- `[showDownload]="false"` (no download in the inbox)
- `[searchPlaceholder]="'Search tickets'"`
- `[(filterActive)]="filterOpen"` — two-way bound to filter shell open state
- `[(settingsActive)]="settingsActive"` — two-way bound to settings panel open state

**Custom buttons projected into the toolbar:**

| Slot | Button | Action |
|---|---|---|
| `toolbar-extra` | **Advanced Search** (filled) | Opens advanced search (`onAdvancedSearch()` — currently a TODO; see "Open questions" below) |
| `toolbar-trailing` | **Save View** (text button) | Opens the save-view modal (`onSaveView()`) |

The toolbar's built-in search input is wired to a debounced ticket-search query. (Engineering owns the search implementation; the prototype has a placeholder input only.)

The toolbar's filter toggle and settings toggle are owned by `<ds-table-toolbar>` and surface via the two-way bindings above. The component's only job for these is to react to `filterOpen` changes (passes through to the filter shell).

## Filter integration

The inbox embeds `<app-filter-shell>` with context key `inbox`. Two-way `open` binding
keeps the toolbar's filter button and the modal in sync.

**Filter count signal flow:**

```
filter-modal-engine.js → 'filterApplied' window event
  → FilterShellComponent.filterCountChange (Output)
  → InboxComponent.onFilterCountChange(count)
  → updates filterCount + viewDirty
```

**Filter-driven side effects in the inbox:**

- `filterCount > 0` → `viewDirty = true` (the saved view has unsaved changes)
- `filterCount === 0` → `viewDirty = false` AND auto-expand the applied-filters bar (`filterBarCollapsed = false`)
- The applied-filters bar is rendered with `hidden` attribute when count is 0; the JS engine toggles it
- **Engineering note:** the `hidden` attribute is set by the filter engine, not by Angular bindings — do not try to bind `[hidden]` to `filterCount === 0`

## Applied filters bar

Three states — collapsed, expanded, hidden:

| State | When | What's shown |
|---|---|---|
| Hidden | `filterCount === 0` | Bar is not rendered (filter engine sets `hidden`) |
| Expanded (default) | `filterCount > 0`, bar not collapsed | Filter chips are visible; "Hide filters" button on the right |
| Collapsed | User clicked "Hide filters" or the count chip | Chips hidden; chip showing `{count} active filters` is shown; "Show filters" button on the right |

**Toggle interactions:**

- Click "Hide filters" button → collapse
- Click "Show filters" button → expand
- Click the count chip (only shown while collapsed) → expand
- When `filterCount` drops to 0, the bar auto-expands so the next filter add is visible

**Aria:**

- The toggle button uses `aria-expanded` and a contextual `aria-label`:
  - Collapsed: `"Show filters, {count} active"`
  - Expanded: `"Hide filters"`

## Save view

Clicking **Save View** in the toolbar opens the save-view modal (`<app-save-view-modal>`)
with `mode="save"`. The modal accepts a name and emits `(confirmed)` with the typed name.

On confirm:

1. Call `TicketsSavedViewsService.save({ name, activeTab, filterCount, ticketCount: 0 })`
   - `ticketCount` is currently `0` because there's no real list yet; engineering wires this to the row count once the table is implemented
2. The service returns a `SavedView` with a generated `id`
3. Navigate to `/tickets/saved-views/{id}` (route resolves to `saved-view.component.ts`)

**Validation rules** (engineering owns):

- Name is required
- Name max length: TBD with PM (recommend 80)
- Duplicate names: TBD with PM (recommend warn-then-allow)

The save modal itself is shared with analytics — see `src/app/features/analytics/shared/save-view-modal/`.

## Data dependencies

| Concern | Source | Status |
|---|---|---|
| Ticket list rows | `TicketsService.getTickets({ scope, filters, search })` | Service file does not exist yet — engineering creates |
| Tab badge counts | `TicketsService.getCounts()` | Service file does not exist yet — engineering creates |
| Saved views | `TicketsSavedViewsService` | Exists at `src/app/core/services/tickets-saved-views.service.ts` (currently in-memory) |
| Filter values | Filter engine, context `inbox` | See `specs-filter-engine.md` |

## States the prototype does not yet show

Engineering must implement and design must sign off on:

- **Loading** while tickets are being fetched (skeleton rows, not a spinner)
- **Empty** when the filter or tab returns zero rows (different copy per tab — e.g. "No tickets assigned to you" vs "No tickets in this view")
- **Error** when the fetch fails (inline retry, not a redirect)
- **Stale** when a refetch is happening but old data is still visible (subtle indicator)

When designs land for these, append them to this spec under a new "States" section.

## Accessibility

- Page title is rendered as `<h1 class="ds-sr-only">Inbox</h1>` — visible to screen readers, not visually
- Tabs use `role="tablist"` / `role="tab"` / `aria-selected`
- Filter and settings toggle buttons get aria from `<ds-table-toolbar>`
- The applied-filters bar uses `role="group"` with `aria-label="Applied filters"`
- The bar's collapse toggle uses `aria-expanded` and a context-sensitive `aria-label`

## Out of scope for the Tickets team

- The filter modal engine itself (vanilla JS, owned by platform)
- The `<ds-table-toolbar>` and `<app-save-view-modal>` components (shared)
- The shell (top nav, sidebar)

## Open questions

- **Advanced Search** (`onAdvancedSearch()`) — what does this open? A modal? A separate route?
  Currently a TODO in the prototype. Needs PM input before engineering implements.
- **Search debounce** — what duration? (Recommend 300ms)
- **Persistence of `activeTab`** across page reloads — is it remembered per user? Needs PM input.
- **Real-time updates** — do tab badges live-update as tickets arrive, or only on refresh? Needs PM input.
