# Filter Engine — How It Works

The filter modal in this project is **not** the `<ds-filter>` Angular component from the design system.
It is a vanilla JS engine (`src/assets/filter-proto/filter-modal-engine.js`) loaded as a
global script, wrapped by thin Angular "filter-shell" components.

This spec is the source of truth for the filter modal. **The entire filter modal is in scope
for engineering** — there is no separate platform team. All three product teams may need to
read, modify, or extend it.

---

## Contents

1. [Architecture overview](#architecture-overview)
2. [Global window API](#global-window-api)
3. [Lifecycle and state semantics](#lifecycle-and-state-semantics)
4. [Context system](#context-system)
5. [Filter group data model](#filter-group-data-model)
6. [Field types](#field-types)
7. [Saved filter sets](#saved-filter-sets)
8. [Adding a new context / page](#adding-a-new-context--page)
9. [Filter-shell pattern](#filter-shell-pattern)
10. [Window events emitted by the engine](#window-events-emitted-by-the-engine)
11. [What is and isn't in scope for engineering](#what-is-and-isnt-in-scope-for-engineering)
12. [Open questions for design](#open-questions-for-design)

---

## Architecture overview

```
angular.json scripts[]
  └─ filter-modal-engine.js    ← vanilla JS, runs globally, owns all filter state

Each page's filter-shell component
  └─ renders the modal HTML shell in its template
  └─ calls window.filterModalInit(context) from ngAfterViewInit
  └─ listens for 'filterApplied' and 'filterModalClose' window events
  └─ re-emits as Angular @Outputs: filterCountChange, filterDateActiveChange, openChange

Parent page component
  └─ @ViewChild(FilterShellComponent) → calls filterShell.getState() / setState() for saved views
  └─ binds [(open)], (filterCountChange), (filterDateActiveChange)
```

---

## Global window API

The engine exposes these functions on `window`. All filter-shells declare them via:

```typescript
declare global {
  interface Window {
    filterModalInit:         (context?: string) => void;
    filterModalOpen:         () => void;
    filterModalClose:        () => void;
    filterModalClearDates:   () => void;
    filterModalGetState:     () => Record<string, unknown>;
    filterModalSetState:     (state: Record<string, unknown>) => void;
    filterModalApplySilent:  () => void;
    filterModalReset:        () => void;
  }
}
```

| Function | When to call |
|---|---|
| `filterModalInit(context?)` | Once from `ngAfterViewInit`; again from `ngOnChanges` when context changes |
| `filterModalOpen()` | When `open` input goes `true` |
| `filterModalClose()` | When `open` input goes `false` |
| `filterModalGetState()` | Before saving a saved view — returns the full serializable state |
| `filterModalSetState(state)` | When loading a saved view |
| `filterModalApplySilent()` | After `setState` — applies without showing the modal |
| `filterModalReset()` | When navigating away from a saved view back to the base route |

---

## Lifecycle and state semantics

The engine has three observable states from the parent's point of view:

| State | What it means |
|---|---|
| **Closed** | Modal is hidden. The committed filter selection is still active. |
| **Open** | Modal is visible. The user is editing a *draft* selection. |
| **Applied** | User clicked Apply. Draft becomes the new committed selection; modal closes; `filterApplied` event fires. |

### Draft vs. committed

While the modal is open, every selection change goes into a **draft** held in
`state.selected` plus per-field draft objects (`state.fieldDateDrafts`, `state.costRangeDraft`,
`state.numericRangeDrafts`, `state.timeRangeDrafts`, `state.textMatchDrafts`).

When the modal opens, the engine takes a `_committedSnapshot` of state. When the
modal closes **without applying** (X, ESC, backdrop click), the draft is discarded
and state is restored from the snapshot.

When the modal closes **with Apply**, the snapshot is overwritten with the new state,
the badge count is updated, and `filterApplied` fires with the new count.

### Internal state shape (engineering reference)

```js
const state = {
  activeGroupId,            // string — currently selected group in left nav
  searchQuery,              // string — current search input value
  selected,                 // Set<optionId> — every selected option (static + dynamic)
  excludedBuckets,          // Set<bucketKey> — tier/group buckets the user marked as exclude
  collapsedTiers,           // Set<tierId> — tiers collapsed in the main panel
  expandedSearchGroups,     // Set<groupId> — search results showing more than 6 hits
  collapsedSelectedBuckets, // Set<bucketKey> — manually collapsed buckets in selected panel
  expandedSelectedBuckets,  // Set<bucketKey> — explicitly expanded (overrides auto-collapse)

  // Field-specific drafts (one entry per active field tier)
  fieldDateDrafts,          // { [tierId]: { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' } }
  costRangeDraft,           // { min: number|null, max: number|null }
  numericRangeDrafts,       // { [tierId]: { min: number|null, max: number|null } }
  timeRangeDrafts,          // { [tierId]: { min: number|null, max: number|null } } (minutes 0–1439)
  textMatchDrafts,          // { [tierId]: { operator: string, value: string } }

  // Date-preset group with optional custom range
  datePresetCustomOpen,     // boolean
  dateRangeDraft,           // { start: Date|null, end: Date|null }
  datePickerViewYear,
  datePickerViewMonth,
  datePickerMode,           // 'range' | 'single'
  calendarOpen,
  activeDateInput,          // 'start' | 'end'

  // Saved filter sets (see "Saved filter sets" below)
  activeFilterSetId,
  savedSetsOpen,
};
```

`getState()` returns a serializable snapshot of this; `setState()` replaces it.
The engine knows how to round-trip every field type.

### Reset vs. clear vs. detach

Three different operations — engineers must use the right one:

| Function | Effect |
|---|---|
| `clearAll()` | Removes all selections in the current draft. Modal stays open. Used by the modal's "Clear All" button. |
| `filterModalReset()` | Closes the modal and resets to a pristine empty state. Used when navigating away from a saved view. |
| `detachFilterSet()` | Keeps current selections but unlinks them from any active saved filter set. Used when the user edits a loaded set and wants to fork it. |

---

## Context system

Every page (and each tab within a page) has its own context key. The engine's `CONTEXTS` map at
the bottom of `filter-modal-engine.js` (~line 1785) maps context keys to filter groups:

```js
const CONTEXTS = {
  'service':                   { label: '...', groups: FILTER_GROUPS_SERVICE_OVERVIEW, savedSetsKey: '...' },
  'assets':                    { label: '...', groups: FILTER_GROUPS_ASSETS,           savedSetsKey: '...' },
  'inbox':                     { label: '...', groups: FILTER_GROUPS_INBOX,            savedSetsKey: '...' },
  'chatbot-overview':          { label: '...', groups: FILTER_GROUPS_CHATBOT_OVERVIEW, savedSetsKey: '...' },
  'call-center-overview':      { label: '...', groups: FILTER_GROUPS_CALL_CENTER_CSAT, savedSetsKey: '...' },
  // ... etc.
};
```

Calling `filterModalInit('call-center-overview')` switches the engine to that context, loads the
correct filter groups, and resets state for that view.

---

## Filter group data model

Every context defines a `FILTER_GROUPS_*` array. Each entry is a **group** that
appears in the modal's left navigation. A group has one of three shapes:

### Shape 1 — Flat group (options directly on the group)

Used when the group has a single list of options with no sub-categorization.

```js
{
  id: 'status',
  label: 'Status',
  icon: 'circle',                  // Material Symbols icon name
  options: [
    { id: 'opt-active', label: 'Active' },
    { id: 'opt-closed', label: 'Closed' },
  ],
}
```

### Shape 2 — Tiered group (options nested in tiers)

Used when the group has multiple sub-sections (each with its own list, or a field type).

```js
{
  id: 'ticket',
  label: 'Ticket',
  icon: 'confirmation_number',
  tiers: [
    { id: 'priority', label: 'Priority', options: [
      { id: 'p-high', label: 'High' },
      { id: 'p-low',  label: 'Low'  },
    ]},
    { id: 'date-created', label: 'Created Date', type: 'date-range' },  // field type tier
  ],
}
```

A tier is either a **list tier** (has `options`) or a **field tier** (has `type` — see
"Field types" below). A group may mix both.

### Shape 3 — Date-preset group (top-level options with preset semantics)

Used by analytics dashboards where the date preset *is* the whole group. Same as a flat
group but with `type: 'date-preset'`. The engine renders preset chips plus an optional
"Custom range" expansion.

```js
{
  id: 'dates',
  label: 'Date',
  icon: 'calendar_today',
  type: 'date-preset',
  options: [
    { id: 'dp-today',         label: 'Today' },
    { id: 'dp-last-7-days',   label: 'Last 7 days' },
    { id: 'dp-last-30-days',  label: 'Last 30 days' },
    { id: 'dp-last-90-days',  label: 'Last 90 days' },
    { id: 'dp-this-month',    label: 'This month' },
  ],
}
```

When the user picks a preset, `dateRangeSelected` fires with `{ label }` for the toolbar
date-button to consume. When the user expands "Custom range" and applies, the same event
fires with the custom-range label.

### Common rules across all shapes

- **`id`** is unique within a context. The engine uses it as a CSS-safe key.
- **`label`** is the user-visible string.
- **`icon`** is a Material Symbols name (group level only). The engine renders it next to
  the group label in the left nav.
- **Option `id`s** must be unique across the entire context (not just within the group),
  because they appear in `state.selected` as a flat set.
- **Option `id` prefixes** are conventional, not enforced (e.g. `as-` for asset-status,
  `atype-` for asset-type). They keep IDs scannable.

---

## Field types

A tier may be a special **field type** instead of a list of options. Field types render
custom UI (date pickers, sliders, text inputs) and serialize their value as a single
**dynamic option ID** that gets added to `state.selected`.

The engine recognises five field types:

### `date-range`

Calendar picker for a single date range. Used on per-field dates (created, purchase, etc.).

```js
{ id: 'date-created', label: 'Created Date', type: 'date-range' }
```

- Draft state: `state.fieldDateDrafts[tierId] = { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }`
- Applied option ID: synthetic, includes the range
- Cleared with `clearDateField(tierId)`

### `date-preset` (group-level, not tier-level)

See "Shape 3 — Date-preset group" above. Not used at the tier level.

### `cost-range`

Min/max dollar slider with optional bounds.

```js
{ id: 'total-cost', label: 'Total Cost', type: 'cost-range', min: 0, max: 5000, step: 50 }
```

- `min` / `max` / `step` define the slider scale
- Draft state: `state.costRangeDraft = { min: number|null, max: number|null }`
  *(only one cost range per context — the engine assumes this)*
- Format: `$1,000 – $3,500` in the applied bar
- Cleared with `clearCostRange(tierId)`

### `numeric-range`

Min/max slider with a unit label and optional "max+" cap.

```js
{
  id: 'cd-duration',
  label: 'Duration',
  type: 'numeric-range',
  min: 0, max: 60, step: 1,
  unit: 'min',
  maxLabel: '60+',          // shown when max value reaches the cap
}
```

- Draft state: `state.numericRangeDrafts[tierId] = { min, max }`
- Multiple numeric ranges per context are supported (keyed by tier id)
- Format: `0 – 30 min` or `30 – 60+ min`
- Cleared with `clearNumericRange(tierId)`

### `time-range`

Min/max time-of-day slider, where values are minutes since midnight (0 to 1439).

```js
{ id: 'cd-time-of-day', label: 'Start Time', type: 'time-range', min: 0, max: 1439, step: 15 }
```

- Draft state: `state.timeRangeDrafts[tierId] = { min, max }`
- Format: `9:00 AM – 5:00 PM` in the applied bar
- Cleared with `clearTimeRange(tierId)`

### `text-match`

Operator dropdown + text input. Used for free-text matching (subject, description, etc.).

```js
{ id: 'inbox-subject', label: 'Subject', type: 'text-match' }
```

- Draft state: `state.textMatchDrafts[tierId] = { operator: string, value: string }`
- Operators come from `TEXT_MATCH_OPERATORS` in the engine (contains, equals, starts with, ends with, does not contain, etc.)
- Format: `Subject contains "password reset"` in the applied bar
- Cleared with `clearTextMatch(tierId)`

### Adding a new field type

If a future tier needs UI the engine doesn't support today (e.g. multi-select dropdown,
geographic radius, percentile range), engineering must:

1. Add a new `type: 'foo'` branch in `buildTierSection()`
2. Add a draft container in `state` (e.g. `state.fooDrafts`)
3. Add `applyFoo(tierId)` and `clearFoo(tierId)` functions
4. Update `_snapshotSelectionState()` and `_restoreSelectionState()`
5. Update `formatFieldValue()` for the applied bar
6. Update `getState()` and `setState()` for saved-view round-trip

---

## Saved filter sets

The engine has its **own** persistence layer for filter combinations, distinct from the
app-level saved views (analytics dashboards / ticket views). Saved filter sets are the
"save these filters for reuse later" feature inside the modal itself.

### Storage

- Per-context, in `localStorage`
- Key format: `onflo-filter-sets-{context}` (configurable via `CONTEXTS[ctx].savedSetsKey`)
- Value: array of `{ id, name, selected: string[], excludedBuckets: string[] }`
- Each set is just a snapshot of selections — it does not carry tab state or page state

### Operations

| Function | What it does |
|---|---|
| `saveCurrentSet(name)` | Snapshots `state.selected` + `state.excludedBuckets` under the given name; sets it as `activeFilterSetId` |
| `loadSavedSet(id)` | Replaces current selections with the named set and marks it active |
| `updateCurrentSet()` | Overwrites the active set with current draft (when the dirty chip says "Update") |
| `deleteSavedSet(id)` | Removes the set from localStorage |
| `detachFilterSet()` | Unlinks the active set without changing current selections |

### Dirty detection

When a saved set is loaded (`activeFilterSetId !== null`), the engine compares
`state.selected` and `state.excludedBuckets` to the saved set on every change.
If they differ, the modal shows an "Update set" button. `hasActiveSetChanges()` is the
function that does this comparison.

### Saved sets vs. saved views — the distinction matters

**Saved filter sets** live inside the filter modal, in `localStorage`, and only carry
filter state. They are personal to the user (browser-bound).

**Saved views** are an app-level concept — they wrap the filter state plus extra page
context (active tab, sort, columns, ticket count for the badge) and are routed.
When implementing saved views, engineering uses `filterModalGetState()` /
`filterModalSetState()` to round-trip the filter portion. See `specs-saved-views.md`.

The two systems do not share storage and should not be conflated.

---

## Adding a new context / page

1. **Define the filter groups** — add a new `FILTER_GROUPS_NEWPAGE` constant near the
   other group constants at the top of `filter-modal-engine.js`. Use the shapes documented
   in [Filter group data model](#filter-group-data-model) and field types from
   [Field types](#field-types).

2. **Register the context** — add an entry to the `CONTEXTS` object:

   ```js
   'my-new-page': {
     label: 'My New Page',
     groups: FILTER_GROUPS_NEWPAGE,
     savedSetsKey: 'onflo-filter-sets-my-new-page',
   },
   ```

   Use a unique `savedSetsKey` per context — this namespaces saved filter sets in localStorage.
   **Never reuse a savedSetsKey** across contexts; doing so cross-contaminates saved sets.

3. **Create a filter-shell component** — copy any existing filter-shell as a starting point.
   Set the `context` default input to your context key:

   ```typescript
   @Input() context = 'my-new-page';
   ```

4. **Wire up the parent page** — see "Filter-shell pattern" below.

---

## Filter-shell pattern

Every filter-shell component follows this exact structure:

### TypeScript (`.ts`)

```typescript
@Component({
  selector: 'app-{page}-filter-shell',
  standalone: true,
  templateUrl: './{page}-filter-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {Page}FilterShellComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input()  open    = false;
  @Input()  context = '{default-context-key}';
  @Output() openChange             = new EventEmitter<boolean>();
  @Output() filterCountChange      = new EventEmitter<number>();
  @Output() filterDateActiveChange = new EventEmitter<boolean>();

  private _initialized = false;

  private _onClose   = () => { this.openChange.emit(false); };
  private _onApplied = (e: Event) => {
    const detail = (e as CustomEvent<{ count: number; hasDateFilter: boolean }>).detail;
    this.filterCountChange.emit(detail?.count ?? 0);
    this.filterDateActiveChange.emit(detail?.hasDateFilter ?? false);
    this.openChange.emit(false);
  };

  ngAfterViewInit(): void {
    window.filterModalInit?.(this.context);
    this._initialized = true;
    window.addEventListener('filterModalClose', this._onClose);
    window.addEventListener('filterApplied',    this._onApplied);
    if (this.open) window.filterModalOpen?.();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._initialized) return;
    if ('context' in changes && !changes['context'].firstChange) {
      window.filterModalInit?.(changes['context'].currentValue);
    }
    if ('open' in changes) {
      changes['open'].currentValue ? window.filterModalOpen?.() : window.filterModalClose?.();
    }
  }

  // Required for saved views — parent gets/sets state via @ViewChild
  getState():               Record<string, unknown> | null { return window.filterModalGetState?.() ?? null; }
  setState(s: Record<string, unknown>): void               { window.filterModalSetState?.(s); }
  applySilent():            void                           { window.filterModalApplySilent?.(); }
  resetState():             void                           { window.filterModalReset?.(); }

  ngOnDestroy(): void {
    window.removeEventListener('filterModalClose', this._onClose);
    window.removeEventListener('filterApplied',    this._onApplied);
  }
}
```

### HTML (`.html`)

The template renders the modal shell HTML that the JS engine uses as its DOM anchor.
Copy the template from `call-center-filter-shell.component.html` exactly — it must match
the structure the engine expects. Do not modify element IDs or class names.

### Parent page wiring

```typescript
// In the parent component class:
@ViewChild({Page}FilterShellComponent) private filterShell!: {Page}FilterShellComponent;

filterOpen         = false;
filterCount        = 0;
filterDateActive   = false;
filterBarCollapsed = signal(false);

// Computed context (for tabbed pages):
filterContext = computed(() => {
  const map: Record<MyTab, string> = {
    'overview': 'my-page-overview',
    'details':  'my-page-details',
  };
  return map[this.activeTab()];
});

onFilterCountChange(count: number): void {
  this.filterCount = count;
  if (count === 0) this.filterBarCollapsed.set(false);
  this.cdr.markForCheck();
}

onFilterDateActiveChange(active: boolean): void {
  this.filterDateActive = active;
  this.cdr.markForCheck();
}
```

```html
<!-- In the parent template — always at the end -->
<app-{page}-filter-shell
  [(open)]="filterOpen"
  [context]="filterContext()"
  (filterCountChange)="onFilterCountChange($event)"
  (filterDateActiveChange)="onFilterDateActiveChange($event)"
/>
```

When `filterDateActive` is true, add the override modifier to the date button:
```html
<button class="ds-dashboard-toolbar__date-select"
        [class.ds-dashboard-toolbar__date-select--overridden]="filterDateActive">
```

---

## Window events emitted by the engine

| Event | `detail` shape | Meaning |
|---|---|---|
| `filterApplied` | `{ count: number; hasDateFilter: boolean }` | User clicked Apply — update badge and filter bar |
| `filterModalClose` | none | User dismissed without applying — close the modal |
| `dateRangeSelected` | `{ label: string }` | Custom date range chosen — update the toolbar date label |

Filter-shells handle `filterApplied` and `filterModalClose` automatically.
For `dateRangeSelected`, the parent page listens directly:

```typescript
private readonly onDateRangeSelected = (e: Event) => {
  const { label } = (e as CustomEvent<{ label: string }>).detail;
  this.dateLabel = label;
  this.cdr.markForCheck();
};
```

The `count` in `filterApplied` includes both static option selections and any active
field-type values (a date range counts as 1, a text-match counts as 1, etc.). It does
**not** count excluded buckets — those are part of the same expression, not additional filters.

`hasDateFilter` is true if any tier of type `date-range` is non-empty, OR if the
date-preset group has a non-default selection. Pages use this to show the
`ds-dashboard-toolbar__date-select--overridden` modifier on the date button (so users
know the filter modal is taking precedence over the toolbar date picker).

---

## What is and isn't in scope for engineering

The filter modal is **fully in scope** for engineering. There is no separate platform
team owning the engine — the three product teams collectively maintain it.

### In scope (fair game to modify)

- `src/assets/filter-proto/filter-modal-engine.js` — the engine itself
- `src/assets/filter-proto/filter-modal.css` — the modal styles
- `FILTER_GROUPS_*` constants — adding, removing, or editing filter options for any context
- `CONTEXTS` map — adding new contexts when adding new pages
- The Angular filter-shell components in each feature folder
- Migrating the engine to TypeScript / Angular (see "Open questions" below)

### Not in scope without design review

- **Changing the filter UX** (modal layout, where buttons live, how field types render)
- **Adding new field types** — design must spec what the new UI looks like first
- **Changing how saved filter sets work** — they are user-facing storage; changes risk
  invalidating saved sets in production
- **Renaming or restructuring contexts** — changes the localStorage `savedSetsKey`
  and orphans existing saved sets
- **Changing option IDs** — same problem; existing saved sets reference these IDs

### Specifically not part of this handoff

- **Advanced Search** (any "Advanced Search" buttons in the prototype) — placeholder only
- The `<ds-filter>` component from the design system — **do not migrate to it**.
  The custom engine is intentional; the DS component does not support tiered groups,
  per-field types, excluded buckets, or saved sets.

---

## Open questions for design

These need resolution before engineering hardens the filter system for production:

- **Saved filter sets in localStorage** — should they sync to the user's account so they
  follow the user across devices? Currently browser-only.
- **Maximum option count per group** — some groups (locations, users) could have hundreds
  of items. Should there be virtualization? Pagination? Server-side search?
- **Filter persistence across sessions** — should the *applied* filter state (not just
  saved sets) survive a refresh? Currently it does not.
- **Migration path** — the engine is vanilla JS. Long-term, should it become a real Angular
  component? (Probably yes, but it's a non-trivial port; see [Adding a new field type](#adding-a-new-field-type) for the size of touch points.)
