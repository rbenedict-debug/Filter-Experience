# Inbox Advanced Filter Logic — Design Spec

**Date:** 2026-06-01
**Branch:** `inbox-filter-columns`
**Status:** Approved design — ready for implementation planning
**Scope:** Inbox filter context only (`FILTER_GROUPS_INBOX` / context key `inbox`)

---

## 1. Background

The inbox filter modal is a vanilla-JS engine (`src/assets/filter-proto/filter-modal-engine.js`)
wrapped by an Angular filter-shell (`src/app/features/tickets/inbox/filter-shell/`). It is **not**
the design-system `<ds-filter>` component and must not be migrated to it.

Today the engine encodes boolean logic **implicitly**:

- Multiple picks within one category → **OR** (Priority is Critical *or* P1).
- Different categories → **AND** (Priority AND Status AND Topic).
- A category can be excluded → **NOT** (`state.excludedBuckets`).

State is a flat `state.selected` (Set of option IDs) plus `state.excludedBuckets` (Set of bucket
keys). Apply does not evaluate tickets — `applyFilters()` renders the applied-filter bar, updates
the badge count, and emits a `filterApplied` window event. `InboxComponent` only tracks
`filterCount` / `viewDirty`. **This is a UI + state prototype, not a live query engine.**

## 2. Problem

Users need boolean expressions the basic UI cannot represent:

1. **OR across different fields** — e.g. "Critical priority **OR** anything from a Board Member."
2. **AND within a multi-value field** — e.g. tickets carrying **both** tag X **and** tag B.
3. **Grouping for precedence** — e.g. `(Tags has all of X, B) OR (Tags has all of A, B)`, optionally
   AND'd with another condition.

Motivating examples from the requester:
- "Tickets with tag X *or* tag Y" → `Tags has any of [X, Y]`.
- "Tickets with tag X and tag B, *or* tickets with tag A and tag B" →
  `(Tags has all of [X, B]) OR (Tags has all of [A, B])`.

The basic facet/chip UI does not extend gracefully to visible operators, grouping, or "has all of."
A separate **Advanced view** with a purpose-built builder is the standard solution (Notion, Airtable,
Linear, Jira, Salesforce all split simple filtering from an advanced builder).

## 3. Goals / Non-goals

**Goals**
- A toggleable Advanced view inside the existing inbox filter modal, same outer modal size.
- A condition-row builder supporting: per-field operators, a root AND/OR connector, and one level of
  nested groups.
- Reuse existing field IDs and option IDs so existing inbox saved filter sets stay valid.
- Additive serialization: saving/loading carries the advanced query without breaking old saved sets.

**Non-goals**
- No real ticket evaluation (consistent with the existing prototype — apply only represents the query).
- No changes to any other filter context or to shared engine UX. Inbox only.
- No migration to `<ds-filter>`.
- No arbitrary-depth nesting (one level of groups only).
- Not wiring advanced filters into ticket *saved views* (those store `activeTab`/counts today, not
  filter state — out of scope, noted as future work).

## 4. Field classification (operators adapt to field type)

The operator set offered per condition depends on what the field is. Classification of every
`FILTER_GROUPS_INBOX` field:

| Field class | Fields | Operators |
|---|---|---|
| **Multi-value list** (a ticket can hold several) | **Tags** (`svc-tags`), **Assigned Agents** (`inbox-agents`), **Action Taken** (`action-taken`) | `has any of` (OR) · `has all of` (AND) · `has none of` (NOT) |
| **Single-value list** (exactly one per ticket) | Priority (`ticket-status`), Status (`inbox-status`), Ticket Type, Ticket Owner, Customer Type, Language, Grade Level, Category, Department, Ticket Theme, Campus, Building, Room, Entry Point, Landing Page, Tab, New Activity, Duplicate, Verified, Loaner Issued, Asset Type, Asset Status, and the four Topic lists (Academics, Enrollment, Facilities, Technology) | `is any of` (OR) · `is none of` (NOT) |
| **Text** | Subject, Description, Ticket No., Customer Name, Submitted By | existing `TEXT_MATCH_OPERATORS` (contains, is, starts with, is blank, …) |
| **Numeric range** | SLA, CX Score, Time in Status, Reopen Count | `is between` (min–max), reusing today's range bounds |
| **Date** | Submission Date, Last Updated | date range / preset, reusing today's picker |

**Multi-value reasoning:** Tags and Assigned Agents are definitionally many-per-ticket (the data
even separates single "Ticket Owner" from multi "Assigned Agents"). Action Taken accrues over a
ticket's life. Everything else is one-per-ticket, where "has all of" would be nonsense. Topic kept
single-value — cross-topic tickets are rare and "is any of" covers the common case.

Implementation: a constant `INBOX_MULTI_VALUE_FIELDS = ['svc-tags', 'inbox-agents', 'action-taken']`.

## 5. Layout & toggle

- Same outer modal dimensions.
- **Basic/Advanced segmented control lives in the footer actions bar**, left-aligned; the
  condition-count summary sits beside it; Cancel / Apply stay on the right.
- Advanced replaces the two-panel body (nav + options + selected) with a single full-width
  condition-row builder. The modal title and footer are preserved; the header **search box is hidden**
  in Advanced (it searches the basic options list, which isn't present — the field dropdown provides
  its own search).
- "Load Filters" (saved sets) remains reachable in Advanced.

Wireframe (Advanced):

```
┌───────────────────────────────────────────────────────────────┐
│  Filters                                                    ✕   │
├───────────────────────────────────────────────────────────────┤
│   Match  [ All ▾ ]  of the following:                           │
│   ┌─────────────────────────────────────────────────────────┐ │
│   │ [ Priority ▾ ] [ is any of ▾ ] [ Critical, P1 High ▾ ] ✕ │ │
│   └─────────────────────────────────────────────────────────┘ │
│   AND                                                           │
│   ┌─────────────────────────────────────────────────────────┐ │
│   │  Match [ Any ▾ ] of:                          (group)  ✕ │ │
│   │   [ Tags ▾ ]    [ has all of ▾ ] [ Tech, Follow-up ▾ ] ✕ │ │
│   │   OR                                                     │ │
│   │   [ Tags ▾ ]    [ has all of ▾ ] [ Escalated, F-up ▾ ] ✕ │ │
│   │   [ + Add condition ]                                    │ │
│   └─────────────────────────────────────────────────────────┘ │
│   [ + Add condition ]   [ + Add group ]                         │
├───────────────────────────────────────────────────────────────┤
│  [ Basic | Advanced ]   3 conditions      [ Cancel ] [ Apply ]  │
└───────────────────────────────────────────────────────────────┘
```

**Field dropdown:** grouped by today's categories and searchable (Ticket ▸ Priority/Status/…,
Activity ▸ …, Topic ▸ …). ~40 fields is too many for a flat list; grouping reuses the basic-nav
mental model. Built from `activeFilterGroups` via a `buildAdvancedFields(groups)` helper.

## 6. Query model

Advanced uses its own serializable tree (it cannot live in `selected`/`excludedBuckets` because
"has all of" has no representation there):

```js
state.advancedQuery = {
  connector: 'AND' | 'OR',
  children: [
    { type: 'condition', field: 'svc-tags', op: 'all', values: ['stag-tech-issue', 'stag-follow-up'] },
    { type: 'group', connector: 'OR', children: [ /* conditions only — one level deep */ ] },
  ],
};
```

- `field` is an existing field ID (tier ID, or group ID for flat/date groups).
- `op` ∈ `any | all | none` (list) · text operators · `between` (numeric) · date operators.
- `values` holds existing option IDs (list), `{min,max}` (numeric), `{from,to}`/preset (date), or
  `{operator,value}` (text).
- Groups contain conditions only (no nested groups → one level deep).

## 7. Mode state & Basic ⇄ Advanced bridge

- New state: `state.filterMode = 'basic' | 'advanced'` (default `'basic'`), plus `state.advancedQuery`.
- Both participate in `_snapshotSelectionState()` / `_restoreSelectionState()` so the draft/committed
  semantics (cancel/ESC/backdrop restores; Apply commits) work in Advanced too.
- **Basic → Advanced:** seed one condition per currently-selected bucket, AND'd at the root; operator
  `any`/`none` derived from include vs `excludedBuckets`; values = selected option IDs in that bucket.
  Nothing lost.
- **Advanced → Basic:** if the query is "simple" (root = AND, no groups, no `has all of`, no repeated
  field, list/any-or-none only) → map losslessly back to `selected` + `excludedBuckets` and switch.
  Otherwise show a confirm: *"Switching to Basic drops your OR / grouping logic. Continue?"* —
  Advanced is sticky.

## 8. Apply, count, applied bar

- **Count** (footer summary, badge, `filterApplied.detail.count`) in Advanced = number of **leaf
  conditions** in the tree.
- **`filterApplied`** continues to emit `{ count, hasDateFilter }`; `hasDateFilter` true if any leaf
  condition is a date field. No change to the Angular shell contract.
- **Applied bar:** advanced queries can't render as today's per-category cards. An applied advanced
  filter renders **one summary card** — "Advanced filter · N conditions" — whose tooltip shows the
  readable expression, and which reopens the modal in Advanced when clicked. (`renderAppliedBar()`
  branches on `state.filterMode`.)

## 9. Saved filter sets (additive serialization)

- A saved set may optionally carry `{ mode: 'advanced', query }` alongside today's
  `{ id, name, selected, excludedBuckets }`.
- Loading a set **with** `query` → opens Advanced and restores the tree. Loading a set **without**
  `query` (every existing inbox set) → stays Basic, unchanged.
- `saveCurrentSet` / `loadSavedSet` / `hasActiveSetChanges` extended to include the query (dirty
  detection compares the tree when in Advanced).
- localStorage key (`onflo-filter-sets-inbox`) is unchanged. **No existing saved set breaks.**
- Ticket *saved views* store `activeTab`/counts only (per `specs-saved-views.md`) — untouched.

## 10. Scope boundaries & engine touch points

Gating: the Basic/Advanced toggle markup lives only in the **inbox filter-shell footer template**, so
other contexts never see it. The engine exposes `window.filterModalSetMode('basic'|'advanced')`; the
toggle calls it and the engine re-renders. Other contexts never call it and stay basic — shared logic
untouched.

Expected edits (all additive, inbox-gated):

- `src/assets/filter-proto/filter-modal-engine.js`
  - State: `filterMode`, `advancedQuery`; include in snapshot/restore and `filterModalInit` reset.
  - New: `buildAdvancedFields(groups)`, `INBOX_MULTI_VALUE_FIELDS`, operator catalogs, `renderAdvanced()`,
    condition/group add-remove-edit handlers, query→count, query→readable-label, basic⇄advanced mappers,
    `window.filterModalSetMode`.
  - `render()` branches on `state.filterMode`; `renderAppliedBar()` and `applyFilters()` handle the
    advanced summary card and leaf-condition count.
  - Saved-set functions carry `query`.
- `src/assets/filter-proto/filter-modal.css` — builder styles (tokens only; focus rings via
  `:focus-visible` + `box-shadow`).
- `src/app/features/tickets/inbox/filter-shell/filter-shell.component.html` — footer
  Basic/Advanced segmented control wired to `window.filterModalSetMode`.

No other filter context, no shared engine UX, no `<ds-filter>`.

## 11. Open questions

None blocking. Multi-value field set (Tags / Assigned Agents / Action Taken) is a judgment call open
to adjustment. Whether advanced filters should later be savable as ticket saved views is deferred.
