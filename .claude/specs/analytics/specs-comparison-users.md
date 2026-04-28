# Comparison — Users — analytics integration

## Scope of this spec

Same scope as the Service Overview spec, applied to the Users comparison page. This
page also adds a **Send Message** button that opens the Notify Users modal.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/analytics/comparison/users/comparison-users.component.ts` |
| Template | `src/app/features/analytics/comparison/users/comparison-users.component.html` |
| Filter shell | `src/app/features/analytics/comparison/users/filter-shell/comparison-users-filter-shell.component.ts` |
| Notify Users modal | `src/app/features/analytics/shared/notify-users-modal/` |
| Save / Share modals | `src/app/features/analytics/shared/` |

## Page identity

| | |
|---|---|
| Filter context key | `comparison-users` |
| Saved-view `sourcePage` | `comparison-users` |
| Help URL | `https://help.onflo.com/analytics/comparison-users` |
| Base route | `/analytics/comparison/users` |
| Saved-view route | `/analytics/comparison/users/saved-views/:id` |

## Page-specific: stats bar

Five clickable stat buttons in the header (between title and toolbar):

```ts
readonly stats: ComparisonUsersStat[] = [
  { id: 'total',      value: '16,399', label: 'Total Tickets' },
  { id: 'ticket-age', value: '2.5',    label: 'Ticket Age' },
  { id: 'cx-score',   value: '8.7',    label: 'Cx Score' },
  { id: 'past-due',   value: '85',     label: 'Past Due' },
  { id: 'critical',   value: '5',      label: 'Unresolved Critical' },
];
```

Stats display **values as strings** (not numbers — the formatting is part of the
backend response; e.g. `'16,399'`, `'2.5'`, `'8.7'`). Engineering replaces the
hardcoded values with an analytics service call.

## Page-specific: Send Message button

The toolbar adds a **Send Message** icon button (after Share):

```html
<button class="ds-dashboard-toolbar__btn"
        type="button"
        aria-label="Send message"
        (click)="onSendMessage()">
  <span class="ds-icon" aria-hidden="true">send</span>
</button>
```

Clicking opens `<app-notify-users-modal [(open)]="notifyOpen" />`. The modal lets the
user message the cohort represented by the current comparison view. Engineering wires
the actual send mechanism (channel, recipient list, audit trail) — the prototype only
shows the modal UI.

The Notify Users modal is a shared component used only by the three comparison pages.

## Required reading

1. `.claude/specs/shared/specs-dashboard.md`
2. `.claude/specs/shared/specs-filter-engine.md`
3. `.claude/specs/shared/specs-saved-views.md`
4. `.claude/specs/analytics/specs-service-overview.md` — same-pattern reference page

## Backend dependencies

| Need | Suggested endpoint |
|---|---|
| Stats bar values | `GET /api/analytics/comparison-users/stats` returning `[{ id, value, label }]` |
| Stat → cohort drill-down | `GET /api/tickets?scope=comparison-users-{statId}` |
| Send message | `POST /api/messages/notify-cohort` body `{ comparisonId, message, channel }` |
| Dashboard data | Existing analytics API |
