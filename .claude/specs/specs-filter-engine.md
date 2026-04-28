# Filter Engine — How It Works

The filter modal in this project is **not** the `<ds-filter>` Angular component from the design system.
It is a vanilla JS prototype engine (`src/assets/filter-proto/filter-modal-engine.js`) loaded as a
global script, wrapped by thin Angular "filter-shell" components.

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

## Adding a new context / page

1. **Add filter group data** — define a new `FILTER_GROUPS_NEWPAGE` constant at the top of
   `filter-modal-engine.js`. Each group is either flat or tiered:

   ```js
   // Flat group — options directly on the group
   { id: 'status', label: 'Status', icon: 'circle', options: [
     { id: 'opt-active', label: 'Active' },
     { id: 'opt-closed', label: 'Closed' },
   ]}

   // Tiered group — options nested inside sub-sections
   { id: 'ticket', label: 'Ticket', icon: 'confirmation_number', tiers: [
     { id: 'priority', label: 'Priority', options: [
       { id: 'p-high', label: 'High' },
       { id: 'p-low',  label: 'Low'  },
     ]},
   ]}
   ```

2. **Register the context** — add an entry to the `CONTEXTS` object:

   ```js
   'my-new-page': {
     label: 'My New Page',
     groups: FILTER_GROUPS_NEWPAGE,
     savedSetsKey: 'onflo-filter-sets-my-new-page',
   },
   ```

   Use a unique `savedSetsKey` per context — this namespaces saved filter sets in localStorage.

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
