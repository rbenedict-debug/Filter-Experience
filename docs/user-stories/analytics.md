# Analytics — user stories

Owner: **Analytics engineering team**
Format reference: [`./README.md`](./README.md)

## Scope

Stories for the new page header, dashboard toolbar, applied filters bar, and saved-view
integration on the eight analytics pages. The chart data and underlying analytics are
already in production and unchanged — engineering integrates the new chrome around
the existing dashboards.

## Roles

- **IT manager** — reviews dashboards to track team and system performance
- **District admin** — uses comparison views and runs custom reports

## How to read this file

Service Overview is the **canonical** analytics page. Its stories (ANL-SO-1 through
ANL-SO-9) describe the full pattern. **Each of the other analytics pages inherits the
same stories** with that page's own ID prefix. Only the page-specific deviations are
written out for each non-canonical page.

| Page | ID prefix |
|---|---|
| Service Overview | `ANL-SO-` |
| Chatbot | `ANL-CB-` |
| Call Center | `ANL-CC-` |
| Comparison — Users | `ANL-CMU-` |
| Comparison — Categories | `ANL-CMC-` |
| Comparison — Topics | `ANL-CMT-` |
| Custom Reports | `ANL-CR-` |
| Fees | `ANL-FE-` |

---

## Epic: Service Overview (canonical analytics page)

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/service-overview
Spec: `.claude/specs/analytics/specs-service-overview.md`

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

## Epic: Chatbot

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/chatbot
Spec: `.claude/specs/analytics/specs-chatbot.md`

**Inherits all `ANL-SO-1` through `ANL-SO-8` stories** with these adjustments:
- Filter context varies by tab: `chatbot-overview` (Overview tab) or `chatbot-chat-logs` (Chat Logs tab)
- Saved view `sourcePage` is `chatbot`
- The Optimization tab has no filter; the toolbar is hidden on that tab

### ANL-CB-1 · Switch tabs and have filters apply per tab

**As an** IT manager
**I want** to switch between Overview, Optimization, and Chat Logs and have the filter
modal switch contexts automatically
**So that** each tab's filter set is relevant to the data shown

**Acceptance criteria**

- [ ] The Chatbot page renders three tabs in the header: Overview, Optimization, Chat Logs
- [ ] Switching tabs updates the page's `filterContext()` signal
- [ ] When `filterContext()` changes, the filter shell re-initializes the filter modal with the new context
- [ ] The Optimization tab does not show the toolbar (no date, filter, save-view, etc.)
- [ ] The Chat Logs tab uses a table layout (`ds-page-content__main--table`)

---

## Epic: Call Center

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/call-center
Spec: `.claude/specs/analytics/specs-call-center.md`

**Inherits all `ANL-SO-1` through `ANL-SO-8` stories** with these adjustments:
- Filter context varies by tab — six contexts total (see spec)
- Saved view `sourcePage` is `call-center`
- Two of the six tabs (Call Details, Agent Status) use a table layout instead of dashboard

### ANL-CC-1 · Switch among Call Center tabs

**As an** IT manager
**I want** to switch among the six Call Center tabs (Overview, Queue Management, CSAT, Call Metrics, Call Details, Agent Status) and have the filter context follow
**So that** the filter modal is always relevant to the data on the current tab

**Acceptance criteria**

- [ ] All six tabs render in the page header
- [ ] Switching tabs updates `filterContext()` to the corresponding key (e.g. `call-center-csat`)
- [ ] The filter shell re-initializes on context change
- [ ] Call Details and Agent Status use the table layout; the others use the dashboard layout

### ANL-CC-2 · Queue Management tab has no date select

**As an** IT manager
**I want** the Queue Management tab toolbar to omit the date select
**So that** I'm not confused into thinking I can pick a past date for live queue data

**Acceptance criteria**

- [ ] On the Queue Management tab, the toolbar renders without `ds-dashboard-toolbar__date-select`
- [ ] All other toolbar buttons (Filter, Save View, Download, Share) remain
- [ ] On every other tab, the date select is present

---

## Epic: Comparison — Users

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/comparison/users
Spec: `.claude/specs/analytics/specs-comparison-users.md`

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
Spec: `.claude/specs/analytics/specs-comparison-categories.md`

**Inherits all `ANL-SO-1` through `ANL-SO-9` stories** plus `ANL-CMU-1`. Only differences:
- Filter context is `comparison-categories`
- Saved view `sourcePage` is `comparison-categories`
- Stats bar values are category-cohort-specific
- Same Send Message button as Comparison — Users

### ANL-CMC-1 · Same as `ANL-CMU-1` for category cohorts

---

## Epic: Comparison — Topics

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/comparison/topics
Spec: `.claude/specs/analytics/specs-comparison-topics.md`

**Inherits all `ANL-SO-1` through `ANL-SO-9` stories** plus `ANL-CMU-1`. Only differences:
- Filter context is `comparison-topics`
- Saved view `sourcePage` is `comparison-topics`
- Stats bar values are topic-cohort-specific
- Same Send Message button as Comparison — Users

### ANL-CMT-1 · Same as `ANL-CMU-1` for topic cohorts

---

## Epic: Custom Reports

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/custom-reports
Spec: `.claude/specs/analytics/specs-custom-reports.md`

**Inherits all `ANL-SO-1` through `ANL-SO-8` stories** (no stats bar, no extra buttons). Only differences:
- Filter context is `custom-reports`
- Saved view `sourcePage` is `custom-reports`
- No stats cards (no `ANL-SO-9` equivalent)
- No tabs

---

## Epic: Fees

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/fees
Spec: `.claude/specs/analytics/specs-fees.md`

**Inherits all `ANL-SO-1` through `ANL-SO-8` stories**. Only differences:
- Filter context is `fees`
- Saved view `sourcePage` is `fees`
- The Fees filter group uses `cost-range` and `text-match` field types (see filter engine spec)
- No stats cards
- No tabs
