# Dashboard — user stories

Owner: **Dashboard engineering team**
Format reference: [`./README.md`](./README.md)

## Scope

Stories for the new page header, dashboard toolbar, applied filters bar, and saved-view
integration on the five Dashboard pages. The chart data and underlying analytics are
already in production and unchanged — engineering integrates the new chrome around
the existing dashboards.

## Roles

- **IT manager** — reviews dashboards to track team and system performance
- **District admin** — uses comparison views and runs custom reports

## How to read this file

Service Overview is the **canonical** Dashboard page. Its stories (ANL-SO-1 through
ANL-SO-9) describe the full pattern. **Each of the other Dashboard pages inherits the
same stories** with that page's own ID prefix. Only the page-specific deviations are
written out for each non-canonical page.

| Page | ID prefix |
|---|---|
| Service Overview | `ANL-SO-` |
| Comparison — Users | `ANL-CMU-` |
| Comparison — Categories | `ANL-CMC-` |
| Comparison — Topics | `ANL-CMT-` |
| Custom Reports | `ANL-CR-` |

---

## Epic: Service Overview (canonical Dashboard page)

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/service-overview
Spec: `.claude/specs/dashboard/specs-service-overview.md`

---

### ANL-SO-1 · Apply filters to the dashboard

**As an** IT manager
**I want** to filter the dashboard by status, priority, location, date, and other attributes
**So that** I can focus the charts on a specific subset of tickets

**Acceptance criteria**

- [ ] The filter button in the toolbar opens the filter modal initialized with the `service` context
- [ ] I can select filter options across all the filter groups defined in `FILTER_GROUPS_SERVICE_OVERVIEW`
- [ ] Clicking **Apply** commits the selection, closes the modal, and updates the chart data
- [ ] The filter button shows a numeric badge equal to the active filter count
- [ ] When the modal has an active date filter, the toolbar's date select shows the override modifier (`ds-dashboard-toolbar__date-select--overridden`)

---

### ANL-SO-2 · Use the applied filters bar to see and manage active filters

Same shape as `TICK-2`. Applied filters bar appears below the toolbar; collapse/expand
toggle; auto-expands when filters are added after being cleared.

---

### ANL-SO-3 · Change the dashboard date range

**As an** IT manager
**I want** to switch the dashboard between common date ranges (last 7 days, this month, etc.)
**So that** I can compare current performance to recent or historical periods

**Acceptance criteria**

- [ ] The date select on the toolbar opens a menu with: All Time, Current School Year, Last School Year, Last 90 Days (default), Last 30 Days, This Month, Last 7 Days, This Week
- [ ] Below the presets is a **Custom Date Range...** option that opens the calendar picker
- [ ] Selecting a preset updates the date label and the dashboard data
- [ ] Selecting a custom range opens a calendar; on confirm, the toolbar label updates with the formatted range
- [ ] If the filter modal has an active date filter and I pick a preset from the toolbar, the modal's date filter is cleared (`window.filterModalClearDates`)

---

### ANL-SO-4 · Save a dashboard view

**As an** IT manager
**I want** to save my current filter selection, date range, and view as a named saved view
**So that** I can return to it without re-applying filters

**Acceptance criteria**

- [ ] The **Save View** button in the toolbar opens the save-view modal in `save` mode
- [ ] I can name the view and click Save
- [ ] On save, a new entry is created via `SavedViewsService` and the URL changes to `/analytics/service-overview/saved-views/{newId}`
- [ ] The saved view appears in the Analytics subnav under "Saved Views"
- [ ] The view captures: name, source page (`service-overview`), filter state, filter count, and date label

---

### ANL-SO-5 · Open a saved view from the subnav

Same shape as `TICK-4`. Clicking a saved view in the subnav navigates to its URL,
which loads the page with `filterShell.setState() + applySilent()` and restores the date label
and filter count. The applied filters bar lands collapsed.

---

### ANL-SO-6 · Edit an existing saved view

Same shape as `TICK-6`. When on a saved-view URL, the primary text button reads
**Edit View** instead of **Save View**. Edit-mode modal lets me update the name and
re-save in place; saving stays on the same URL.

---

### ANL-SO-7 · Delete a saved view

Same shape as `TICK-7`. The edit-mode modal has a Delete action; deleting redirects
to the base route (`/analytics/service-overview`) with empty filter state.

---

### ANL-SO-8 · Share the dashboard

**As an** IT manager
**I want** to share the current dashboard with someone else
**So that** they can see the same data without me re-creating the filter for them

**Acceptance criteria**

- [ ] The **Share** icon button in the toolbar opens the Share Dashboard modal
- [ ] The modal UI is the **final design** — engineering only wires the backend mechanism
- [ ] The share payload should include the current saved-view URL (or filter state) so the recipient sees the same view
- [ ] The modal closes after a successful share

---

### ANL-SO-9 · Drill into the stats cards

**As an** IT manager
**I want** to click any of the four KPI cards in the page header
**So that** I can see the underlying tickets that drive each number

**Acceptance criteria**

- [ ] The four stat cards (Total Tickets, Tickets Currently Open, Unresolved Critical Tickets, Past Due Tickets) are clickable buttons
- [ ] Clicking a card navigates to the Tickets list filtered by that scope
- [ ] Each card has an `aria-label` of the form `"{count} {label} — view tickets"`
- [ ] The stats values are populated from an analytics API call (replace the prototype's hardcoded values)

---

## Epic: Comparison — Users

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/comparison/users
Spec: `.claude/specs/dashboard/specs-comparison-users.md`

**Inherits all `ANL-SO-1` through `ANL-SO-9` stories** with these adjustments:
- Filter context is `comparison-users`
- Saved view `sourcePage` is `comparison-users`
- Stats bar has 5 stats (not 4): Total Tickets, Ticket Age, Cx Score, Past Due, Unresolved Critical
- Stat values are pre-formatted strings (e.g. `'16,399'`, `'2.5'`) — backend returns them formatted
- Adds the Send Message (Notify Users) button described below

### ANL-CMU-1 · Notify the cohort represented by this comparison

**As a** district admin
**I want** to click a Send Message button on the comparison page to message the user
cohort behind the current view
**So that** I can communicate with the affected users without leaving the dashboard

**Acceptance criteria**

- [ ] A Send Message icon button appears in the toolbar (after Share)
- [ ] Clicking it opens the Notify Users modal (final design — not a placeholder)
- [ ] The modal lets me compose and send a message to the cohort
- [ ] The send mechanism (channel, recipient list, audit trail) is engineering's call on the backend
- [ ] The recipient list is derived from the current comparison view's filters and cohort

---

## Epic: Comparison — Categories

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/comparison/categories
Spec: `.claude/specs/dashboard/specs-comparison-categories.md`

**Inherits all `ANL-SO-1` through `ANL-SO-9` stories** plus `ANL-CMU-1`. Only differences:
- Filter context is `comparison-categories`
- Saved view `sourcePage` is `comparison-categories`
- Stats bar values are category-cohort-specific
- Same Send Message button as Comparison — Users

### ANL-CMC-1 · Same as `ANL-CMU-1` for category cohorts

---

## Epic: Comparison — Topics

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/comparison/topics
Spec: `.claude/specs/dashboard/specs-comparison-topics.md`

**Inherits all `ANL-SO-1` through `ANL-SO-9` stories** plus `ANL-CMU-1`. Only differences:
- Filter context is `comparison-topics`
- Saved view `sourcePage` is `comparison-topics`
- Stats bar values are topic-cohort-specific
- Same Send Message button as Comparison — Users

### ANL-CMT-1 · Same as `ANL-CMU-1` for topic cohorts

---

## Epic: Custom Reports

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/custom-reports
Spec: `.claude/specs/dashboard/specs-custom-reports.md`

**Inherits all `ANL-SO-1` through `ANL-SO-8` stories** (no stats bar, no extra buttons). Only differences:
- Filter context is `custom-reports`
- Saved view `sourcePage` is `custom-reports`
- No stats cards (no `ANL-SO-9` equivalent)
- No tabs
