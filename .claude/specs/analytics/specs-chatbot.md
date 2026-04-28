# Chatbot — analytics integration

## Scope of this spec

Same scope as the Service Overview spec, applied to Chatbot:

1. New page header (title row, last-updated meta, learn-more link, **tabs**)
2. New dashboard toolbar (date select, filter, Save/Edit View, Download, Share)
3. Applied filters bar
4. Saved-view integration

The chart data and underlying analytics are already in production. Engineering
integrates the new chrome around the existing dashboards.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/analytics/chatbot/chatbot.component.ts` |
| Template | `src/app/features/analytics/chatbot/chatbot.component.html` |
| Filter shell | `src/app/features/analytics/chatbot/filter-shell/chatbot-filter-shell.component.ts` |
| Save / Share modals | `src/app/features/analytics/shared/` (same as Service Overview) |

## Page identity

| | |
|---|---|
| Saved-view `sourcePage` | `chatbot` |
| Help URL | `https://help.onflo.com/analytics/chatbot` |
| Base route | `/analytics/chatbot` |
| Saved-view route | `/analytics/chatbot/saved-views/:id` |

## Tabs

Chatbot has three tabs in the page header. Each tab maps to its own filter context
(passed into the filter shell via `[context]="filterContext()"`):

| Tab | Filter context | Notes |
|---|---|---|
| Overview | `chatbot-overview` | Standard dashboard |
| Optimization | _none — no filter on this tab_ | The filter button is hidden on this tab |
| Chat Logs | `chatbot-chat-logs` | Table tab — uses `ds-page-content__main--table` instead of `--dashboard` |

The filter context is a `computed()` signal in the component:

```ts
filterContext = computed(() => {
  const tab = this.activeTab();
  if (tab === 'overview') return 'chatbot-overview';
  return 'chatbot-chat-logs';
});
```

When the user switches tabs, the filter modal re-initializes for the new context
(handled by the filter-shell pattern — see shared spec).

**Tabs go inside `ds-page-content__heading`** (not as a sibling). See the canonical
dashboard spec for the markup pattern, including the `gap: 0` SCSS override required
when tabs are present.

## Toolbar variants per tab

- **Overview / Chat Logs:** standard toolbar (date, filter, Save View, Download, Share)
- **Optimization:** toolbar is hidden (no filter, no date, no save view) since this tab
  has its own UI

Use `@if (activeTab() !== 'optimization')` to conditionally render the toolbar block.

## Required reading

1. `.claude/specs/shared/specs-dashboard.md` — canonical dashboard layout (incl. tab variant)
2. `.claude/specs/shared/specs-filter-engine.md` — the filter modal
3. `.claude/specs/shared/specs-saved-views.md` — saved-view storage and load flow
4. `.claude/specs/analytics/specs-service-overview.md` — same-pattern reference page

## Backend dependencies

Same as cross-cutting analytics endpoints in `specs-saved-views.md`. No chatbot-specific
endpoints needed beyond the existing dashboard data sources already in production.
