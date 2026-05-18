# Assets — user stories

Owner: **Assets engineering team**
Format reference: [`./README.md`](./README.md)

## Scope

Stories for the new filter modal and applied-filters-bar integration on the four
Assets list pages. The pages, their tables, and the existing custom-views feature
are already in production and not part of this handoff.

The Save View button on Assets pages hooks into the **existing production custom-views
feature** — that flow is not part of this handoff. Stories below cover only what's new
(filter modal, applied bar).

## Roles

- **Asset administrator** — manages devices and equipment for the district
- **IT staff** — investigates specific assets or user assignments

## How to read this file

Asset Views is the **canonical** Assets page. Its stories (AST-AV-1, AST-AV-2)
describe the filter and applied-filters-bar pattern. Each of the other Assets pages
inherits the same stories with that page's own ID prefix. Only page-specific
deviations (or notes about new filter contexts engineering must create) are written
out for each.

| Page | ID prefix |
|---|---|
| Asset Views | `AST-AV-` |
| By Locations | `AST-BL-` |
| By Users | `AST-BU-` |
| By Purchase Order | `AST-BPO-` |

---

## Epic: Asset Views (canonical Assets page)

Prototype: https://rbenedict-debug.github.io/Filter-Experience/assets/asset-views
Spec: `.claude/specs/assets/specs-asset-views.md`

---

### AST-AV-1 · Apply filters to the Asset Views page

**As an** asset administrator
**I want** to filter the Asset Views table by status, type, manufacturer, location, tags, and other attributes
**So that** I can quickly narrow the table to the assets I'm working with

**Acceptance criteria**

- [ ] The filter button in the toolbar opens the filter modal initialized with the `assets` context
- [ ] I can select filter options across all the filter groups defined in `FILTER_GROUPS_ASSETS`
- [ ] Clicking **Apply** commits the selection, closes the modal, and updates the table
- [ ] The filter button shows a numeric badge equal to the active filter count
- [ ] The badge disappears when the count is 0

**Reference**

- Prototype: https://rbenedict-debug.github.io/Filter-Experience/assets/asset-views
- Spec: `.claude/specs/assets/specs-asset-views.md` and `.claude/specs/shared/specs-filter-engine.md`

---

### AST-AV-2 · Use the applied filters bar to see and manage active filters

Same shape as `TICK-2`. Bar appears below the toolbar when filters are active;
collapse/expand toggle; auto-expands when filters are added after being cleared.

---

### AST-AV-3 · Save the current filter selection (uses the existing custom-views feature)

**As an** asset administrator
**I want** to save my current filter selection as a custom view on the Asset Views page
**So that** I can return to it later without re-applying filters

**Acceptance criteria**

- [ ] The Save View button hooks into the existing production custom-views feature
- [ ] Engineering integrates the new filter state into whatever custom-view payload that feature already supports
- [ ] The custom view appears on the Asset Views page using the existing custom-views UI (selector, dropdown, or however the prod feature surfaces them)
- [ ] No new "saved view" subnav entry, route, or service is required for this handoff — re-use what's in production

> **Note for engineering and PM:** the design and payload for the existing custom-views
> feature is documented in the production codebase, not this prototype. Reference the
> existing implementation; do not invent a new pattern.

---

## Epic: By Locations

Prototype: https://rbenedict-debug.github.io/Filter-Experience/assets/by-locations
Spec: `.claude/specs/assets/specs-by-locations.md`

**Inherits all `AST-AV-1` through `AST-AV-3` stories** with these adjustments:
- Filter context is `assets-locations` (engineering creates this — does not exist yet)
- Filter groups are `FILTER_GROUPS_LOCATIONS` (engineering defines)
- The page has four location-type tabs (Building, Room, Container, Special Area) — all share the same context for v1

### AST-BL-1 · Engineering creates a new filter context for locations

**As an** Assets engineer
**I want** to add a new `assets-locations` context and `FILTER_GROUPS_LOCATIONS` to the engine
**So that** the filter button on the By Locations page does something useful

**Acceptance criteria**

- [ ] A new `FILTER_GROUPS_LOCATIONS` constant is defined in `filter-modal-engine.js`
- [ ] A new `assets-locations` entry is added to the `CONTEXTS` map with a unique `savedSetsKey`
- [ ] A new `app-by-locations-filter-shell` component is created following the filter-shell pattern
- [ ] The filter shell is mounted in `by-locations.component.html` and wired to the existing `filterOpen` and `filterCount` signals
- [ ] The filter context is set to `assets-locations`

---

## Epic: By Users

Prototype: https://rbenedict-debug.github.io/Filter-Experience/assets/by-users
Spec: `.claude/specs/assets/specs-by-users.md`

**Inherits all `AST-AV-1` through `AST-AV-3` stories** with these adjustments:
- Filter context is `assets-users` (engineering creates)
- Filter groups are `FILTER_GROUPS_USERS` (engineering defines)
- No tabs

### AST-BU-1 · Engineering creates a new filter context for users

Same shape as `AST-BL-1` but for users (`assets-users` context, `FILTER_GROUPS_USERS`,
`app-by-users-filter-shell`).

### AST-BU-2 · The user list uses the "show more" pattern for long lists

**As an** asset administrator
**I want** the user filter group to show only the first N users initially with a "Show more" expansion
**So that** the modal doesn't render hundreds of users at once

**Acceptance criteria**

- [ ] When the user filter group has more than 10–15 options, the modal renders the first N inline
- [ ] A "Show more" button below the list expands the rest
- [ ] The modal's existing search input filters across the full list, regardless of expansion state

> **Note:** the "show more" pattern is described in `specs-filter-engine.md` under
> "Large option lists". Engineering implements it (or restores it if it was previously
> in the design system and got dropped).

---

## Epic: By Purchase Order

Prototype: https://rbenedict-debug.github.io/Filter-Experience/assets/by-purchase-order
Spec: `.claude/specs/assets/specs-by-purchase-order.md`

**Inherits all `AST-AV-1` through `AST-AV-3` stories** with these adjustments:
- Filter context is `assets-purchase-orders` (engineering creates)
- Filter groups are `FILTER_GROUPS_PURCHASE_ORDERS` (engineering defines, includes `cost-range`, `text-match`, and `date-range` field types — see filter engine spec)
- No tabs

### AST-BPO-1 · Engineering creates a new filter context for purchase orders

Same shape as `AST-BL-1` but for purchase orders (`assets-purchase-orders` context,
`FILTER_GROUPS_PURCHASE_ORDERS`, `app-by-purchase-order-filter-shell`).
