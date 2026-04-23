# Dashboard Page Layout — Canonical Pattern

`src/app/features/analytics/service-overview/` is the reference implementation.
All analytics dashboard pages follow this structure. Read this before building any dashboard.

---

## Structure overview

A dashboard page has three zones stacked vertically:

```
┌─────────────────────────────────────────────────────┐
│  ds-page-content__dashboard-header  (sticky)        │
│  ├─ Heading row  (title + optional meta/help)        │
│  ├─ [Quick links / stats bar]        optional        │
│  ├─ [Tabs]                           optional        │
│  ├─ Toolbar row  (date filter + actions)             │
│  └─ [Applied filters bar]            optional        │
├─────────────────────────────────────────────────────┤
│  ds-page-content__main--dashboard  (scrolls)        │
│  └─ Dashboard canvas / chart grid                   │
└─────────────────────────────────────────────────────┘
```

The header block is sticky — it never scrolls. The canvas below it scrolls independently.

---

## Canonical HTML skeleton

```html
<!-- Sticky dashboard header -->
<div class="ds-page-content__dashboard-header">

  <!-- Zone 1: Heading row — always present -->
  <div class="ds-page-content__heading ds-page-content__heading--row">
    <h1 class="ds-page-content__title">Page Title</h1>

    <!-- Right side: optional help link + optional last-updated -->
    <div class="{page}__heading-meta">
      <!-- Help link — include when page has a learning center article -->
      <a class="ds-button ds-button--text ds-button--xs ds-button--trailing-icon"
         href="https://help.onflo.com/..."
         target="_blank"
         rel="noreferrer noopener"
         aria-label="Learn more about [Page Title] — opens learning center in a new tab">
        Learn more
        <span class="ds-icon" aria-hidden="true">open_in_new</span>
      </a>
      <!-- Last-updated timestamp — include when page has live data -->
      <p class="ds-page-content__meta">Last updated {{ ts | date:'MMM d, y, h:mm a' }}</p>
    </div>
  </div>

  <!-- Zone 2a: Quick links / stats bar — optional, omit if not needed -->
  <!-- See "Quick links variant" below -->

  <!-- Zone 2b: Tabs — optional, omit if not needed -->
  <!-- See "Tabs variant" below -->

  <!-- Zone 3: Toolbar row — always present -->
  <div class="ds-dashboard-toolbar" style="padding: 0;">
    <div class="ds-dashboard-toolbar__controls {page}__toolbar-controls">

      <!-- Left: date filter is always here; add other controls after it -->
      <div class="{page}__toolbar-left">
        <!-- Date filter — see service-overview for the full date menu pattern -->
        <button class="ds-dashboard-toolbar__date-select" type="button"
                aria-haspopup="menu" [attr.aria-expanded]="dateMenuOpen"
                (click)="toggleDateMenu()">
          <span class="ds-icon ds-icon--sm" aria-hidden="true">calendar_today</span>
          <span class="ds-dashboard-toolbar__date-label">{{ dateLabel }}</span>
          <span class="ds-icon ds-icon--sm" aria-hidden="true">arrow_drop_down</span>
        </button>
        <!-- Additional left-side controls go here (e.g. compare toggle, grouping) -->
      </div>

      <!-- Right: standard action buttons — include as needed per page -->
      <div class="{page}__toolbar-right">
        <!-- Filter button with badge -->
        <div class="ds-badge-indicator__host">
          <button class="ds-dashboard-toolbar__btn" type="button"
                  aria-label="Filter" (click)="filterOpen = true">
            <span class="ds-icon" aria-hidden="true">filter_alt</span>
          </button>
          @if (filterCount > 0) {
            <div class="ds-badge-indicator" aria-hidden="true">{{ filterCount }}</div>
          }
        </div>
        <!-- Download, Share, Save View — include as needed -->
        <button class="ds-dashboard-toolbar__btn" type="button"
                aria-label="Download" (click)="onDownload()">
          <span class="ds-icon" aria-hidden="true">download</span>
        </button>
        <button class="ds-dashboard-toolbar__btn" type="button"
                aria-label="Share" (click)="onShare()">
          <span class="ds-icon" aria-hidden="true">share</span>
        </button>
        <button class="ds-dashboard-toolbar__text-btn" type="button"
                (click)="onSave()">Save View</button>
      </div>

    </div>
  </div>

  <!-- Applied filters bar — always included when filter is present; hidden when no filters active -->
  <div class="filter-applied-bar" id="filter-applied-bar" hidden
       style="background:transparent; border-bottom:none; padding:0;">
    <span class="filter-applied-bar__label">Filters</span>
    <div class="filter-applied-bar__cards" id="filter-applied-cards"
         role="group" aria-label="Applied filters"></div>
  </div>

</div><!-- /.ds-page-content__dashboard-header -->

<!-- Scrolling canvas -->
<div class="ds-page-content__main ds-page-content__main--dashboard">
  <div class="{page}-canvas">
    <!-- chart grid, metric cards, etc. -->
  </div>
</div>

<!-- Filter shell — always at the end of the component template -->
<app-{page}-filter-shell
  [(open)]="filterOpen"
  (filterCountChange)="onFilterCountChange($event)"
  (filterDateActiveChange)="onFilterDateActiveChange($event)"
/>
```

Replace `{page}` with the feature slug (e.g. `service-overview`, `call-center`).

---

## Heading row — right-side meta group

The heading row uses `--row` variant so title and meta sit on one line.
The right side is a flex group. Include only what the page needs:

| Element | When to include |
|---|---|
| Help link (`ds-button--text --xs`) | Page has a learning center article |
| Last updated timestamp | Page shows live or near-live data |
| Both | Most analytics dashboards |
| Neither | Omit the meta wrapper entirely |

```html
<!-- Both present (standard) -->
<div class="{page}__heading-meta">
  <a class="ds-button ds-button--text ds-button--xs ds-button--trailing-icon" ...>
    Learn more <span class="ds-icon" aria-hidden="true">open_in_new</span>
  </a>
  <p class="ds-page-content__meta">Last updated {{ ts | date:'MMM d, y, h:mm a' }}</p>
</div>

<!-- Help only -->
<a class="ds-button ds-button--text ds-button--xs ds-button--trailing-icon" ...>
  Learn more <span class="ds-icon" aria-hidden="true">open_in_new</span>
</a>

<!-- Neither — heading row has no right-side content -->
<div class="ds-page-content__heading ds-page-content__heading--row">
  <h1 class="ds-page-content__title">Page Title</h1>
</div>
```

---

## Variant: No quick links

Omit Zone 2a entirely. The heading row sits directly above the toolbar.
This is valid — not every dashboard has surfaced KPI counts.

```html
<div class="ds-page-content__dashboard-header">
  <div class="ds-page-content__heading ds-page-content__heading--row">
    <h1 class="ds-page-content__title">Page Title</h1>
    ...
  </div>
  <!-- toolbar goes here directly -->
  <div class="ds-dashboard-toolbar" ...>
```

---

## Variant: Tabs below the title

Tabs go **inside** `ds-page-content__heading`, not as a sibling of it.
Placing tabs outside the heading makes them a direct child of `ds-page-content__dashboard-header`,
which applies `gap: var(--spacing-lg)` between them — producing a large unwanted gap under the title.

Always override `gap: 0` on the heading in the component SCSS when tabs are present.
The default `gap: var(--spacing-xs)` also creates a small visible gap that should not be there.

When the page also needs a title + right-side meta (last updated, help link), wrap those in an
inner `{page}__title-row` div so the title and meta stay on one line above the tabs:

```html
<div class="ds-page-content__dashboard-header">

  <div class="ds-page-content__heading">

    <!-- Title + meta on one row (only when right-side meta is needed) -->
    <div class="{page}__title-row">
      <h1 class="ds-page-content__title">Page Title</h1>
      <p class="ds-page-content__meta">Last updated {{ ts | date:'MMM d, y, h:mm a' }}</p>
    </div>

    <!-- Tabs inside the heading — never outside it -->
    <div class="ds-tabs" role="tablist" aria-label="...">
      <button class="ds-tabs__tab" ...>Tab 1</button>
      <button class="ds-tabs__tab" ...>Tab 2</button>
    </div>

  </div><!-- /.ds-page-content__heading -->

  <!-- toolbar + applied bar follow as siblings of the heading -->
  @if (!isTableTab()) {
    <div class="ds-dashboard-toolbar" style="padding: 0;">...</div>
    ...
  }

</div>
```

Required SCSS when tabs are present:

```scss
// Collapse default xs gap — tabs must sit flush under the title
.ds-page-content__heading {
  gap: 0;
}

// Title + meta row (only needed when right-side meta exists alongside tabs)
.{page}__title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
```

The toolbar's date filter and actions apply to whichever tab is active.
If a tab needs entirely different toolbar controls, manage toolbar visibility reactively
via `@if (activeTab === '...')` inside the toolbar left/right groups.

---

## Variant: Additional toolbar controls

Add controls after the date filter inside `{page}__toolbar-left`,
or add additional icon buttons inside `{page}__toolbar-right` before the standard actions.

```html
<!-- Example: compare toggle + segment picker on the left -->
<div class="{page}__toolbar-left">
  <!-- date filter first, always -->
  <button class="ds-dashboard-toolbar__date-select" ...>...</button>

  <!-- additional left controls -->
  <button class="ds-dashboard-toolbar__btn" type="button" aria-label="Compare">
    <span class="ds-icon" aria-hidden="true">compare_arrows</span>
  </button>
  <ds-select ... />
</div>
```

The date filter is always the leftmost control. Additional controls follow it.
Never move the date filter to the right side.

---

## Component class — minimum required signals/properties

```typescript
// Date filter
dateLabel = 'Last 90 Days';
dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months', 'All Time'];
dateMenuOpen = false;
filterDateActive = false;  // true when filter modal overrides the date

toggleDateMenu() { this.dateMenuOpen = !this.dateMenuOpen; }
selectDate(option: string) { this.dateLabel = option; this.dateMenuOpen = false; }

// Filter
filterOpen = false;
filterCount = 0;
onFilterCountChange(count: number) { this.filterCount = count; }
onFilterDateActiveChange(active: boolean) { this.filterDateActive = active; }

// Toolbar actions
onDownload() { /* ... */ }
onShare()    { /* ... */ }
onSave()     { /* ... */ }

// Last updated (when applicable)
lastUpdated = new Date();
```

---

## SCSS conventions for dashboard pages

Each dashboard page scopes its toolbar layout under page-specific classes.
Shared DS classes (`ds-dashboard-toolbar`, `ds-dashboard-toolbar__btn`, etc.) are not overridden.

Minimum required:

```scss
.{page}__heading-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.{page}__toolbar-controls {
  width: 100%;
  justify-content: space-between;
}

.{page}__toolbar-left,
.{page}__toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

// Date menu dropdown anchor
.{page}__date-wrapper {
  position: relative;
}
```

---

## What does not change between dashboards

- The `ds-page-content__dashboard-header` sticky wrapper
- The `ds-page-content__heading--row` pattern for the title row
- The `ds-dashboard-toolbar` with date filter on the left
- The applied filters bar pattern (hidden when count is 0)
- The `ds-page-content__main--dashboard` canvas wrapper
- The filter shell at the end of the template
- `open_in_new` as the trailing icon on help links
- `aria-label` format: `"Learn more about [Page Title] — opens learning center in a new tab"`
