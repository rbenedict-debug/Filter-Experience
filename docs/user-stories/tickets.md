# Tickets — user stories

Owner: **Tickets engineering team**
Format reference: [`./README.md`](./README.md)

## Scope

Stories for the filter + saved-views integration into the existing Inbox page. The
existing Inbox functionality (tabs, search, settings panel, table) is in production
and not part of this handoff.

## Roles

- **Support agent** — daily user of the inbox, processing tickets

---

## Epic: Inbox — filter, applied bar, Save View, saved-views subnav

Prototype: https://rbenedict-debug.github.io/Filter-Experience/tickets/inbox
Spec: `.claude/specs/tickets/specs-inbox.md`

---

### TICK-1 · Apply filters to my inbox

**As a** support agent
**I want** to filter the inbox by status, priority, location, and other attributes
**So that** I can focus on the tickets relevant to my current task

**Acceptance criteria**

- [ ] The filter button in the toolbar opens the filter modal initialized with the `inbox` context
- [ ] I can select filter options across all the filter groups defined in `FILTER_GROUPS_INBOX`
- [ ] Clicking **Apply** commits the selection, closes the modal, and updates the table data
- [ ] Clicking the X, ESC, or the backdrop discards my draft selection (the previously committed filters remain)
- [ ] The filter button shows a numeric badge equal to the active filter count
- [ ] The badge disappears when the count is 0

**Reference**

- Prototype: https://rbenedict-debug.github.io/Filter-Experience/tickets/inbox
- Spec: `.claude/specs/tickets/specs-inbox.md` and `.claude/specs/shared/specs-filter-engine.md`

---

### TICK-2 · Use the applied filters bar to see and manage active filters

**As a** support agent
**I want** to see my active filters as chips below the toolbar and collapse them when I need screen space
**So that** I always know what filters are applied without having to re-open the modal

**Acceptance criteria**

- [ ] The applied filters bar appears below the toolbar when at least one filter is active
- [ ] Each active filter renders as a chip in the bar
- [ ] The bar is hidden when the active filter count drops to 0
- [ ] Clicking **Hide filters** collapses the bar to a single chip showing `{count} active filters`
- [ ] Clicking the count chip or **Show filters** re-expands the bar
- [ ] When all filters are cleared and then a new filter is added, the bar auto-expands
- [ ] The toggle button's `aria-expanded` and `aria-label` reflect the current state

---

### TICK-3 · Save the current filter selection as a saved view

**As a** support agent
**I want** to save my current filters and active tab as a named view
**So that** I can return to that exact configuration later without rebuilding it

**Acceptance criteria**

- [ ] The **Save View** button in the toolbar opens the save-view modal in `save` mode
- [ ] I can type a name and click Save
- [ ] On save, a new entry is created via `TicketsSavedViewsService` and the URL changes to `/tickets/saved-views/{newId}`
- [ ] The saved view appears in the Tickets subnav under "Saved Views"
- [ ] The view captures: name, active tab, filter state, filter count, and a placeholder ticket count of 0 (backend populates the real count)
- [ ] If I cancel the modal, no view is saved and I stay on the inbox

---

### TICK-4 · Open a saved view from the subnav

**As a** support agent
**I want** to click a saved view in the subnav to load it
**So that** I can switch between common workflows quickly

**Acceptance criteria**

- [ ] Each saved view in the subnav is a clickable button
- [ ] Clicking it navigates to `/tickets/saved-views/{id}`
- [ ] The page loads with the saved filter state re-applied (via `filterModalSetState` + `applySilent`)
- [ ] The active tab is restored from the saved view
- [ ] The filter count badge and applied filters bar match the loaded state
- [ ] The applied filters bar renders collapsed by default when arriving on a saved view URL

---

### TICK-5 · See ticket counts on saved views in the subnav

**As a** support agent
**I want** to see a count badge next to each saved view
**So that** I know how many tickets match each saved view at a glance

**Acceptance criteria**

- [ ] Saved views with `ticketCount > 0` display a grey badge with the count
- [ ] Counts greater than 999 display as `999+`
- [ ] Counts of 0 do not display a badge
- [ ] The count updates in real-time when ticket data changes — or via a 60-second polling fallback when the user is in the Tickets section
- [ ] Polling is paused when the browser tab is hidden (`document.visibilityState !== 'visible'`)

---

### TICK-6 · Edit an existing saved view

**As a** support agent
**I want** to update a saved view's name or filters when my workflow changes
**So that** I don't accumulate stale views

**Acceptance criteria**

- [ ] When on a saved-view URL, the toolbar's primary text button reads **Edit View**
- [ ] Clicking it opens the save-view modal in `edit` mode, pre-populated with the view's current name
- [ ] I can change the name and click Save to update the view in place
- [ ] After save, the URL stays the same (`/tickets/saved-views/{id}`) and the subnav label updates
- [ ] If I change my filters before clicking Edit, those changes are saved into the view when I confirm

---

### TICK-7 · Delete a saved view

**As a** support agent
**I want** to delete a saved view I no longer use
**So that** my subnav stays uncluttered

**Acceptance criteria**

- [ ] The save-view modal in `edit` mode exposes a Delete action
- [ ] Confirming deletion removes the saved view from `TicketsSavedViewsService` and the subnav
- [ ] After deletion, I'm redirected to `/tickets/inbox` with empty filter state
- [ ] No undo is required (deletion is straightforward)

---

### TICK-8 · Stale filter options on a saved view

**As a** support agent
**I want** my saved views to keep working even when the filter options change (e.g. a location is deleted)
**So that** old views don't show errors

**Acceptance criteria**

- [ ] When loading a saved view, any filter option IDs that no longer exist are silently dropped
- [ ] The view re-applies with the remaining valid filters
- [ ] No banner, warning, or error UI is shown
- [ ] The saved view's stored `filterState` is cleaned up so the dropped IDs are not re-processed on subsequent loads

---

### TICK-9 · Filters survive a page refresh

**As a** support agent
**I want** my applied filters to stay after I refresh the page
**So that** I don't lose my context

**Acceptance criteria**

- [ ] When I apply filters, the URL gets a `?filters={base64}` query param
- [ ] Refreshing the page re-applies those filters from the URL
- [ ] When I log out and log back in, I land on `/tickets/inbox` with no filters (the post-login redirect goes to the base route)
- [ ] If I want filters to persist across logout, I use the Save View flow (story TICK-3)
