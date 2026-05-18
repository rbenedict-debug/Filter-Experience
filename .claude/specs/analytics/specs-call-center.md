# Call Center — analytics integration

## Scope of this spec

Same scope as the Service Overview spec, applied to Call Center. Call Center has the
**most tabs of any analytics page (6)** and mixes dashboard tabs with table tabs.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/analytics/call-center/call-center.component.ts` |
| Template | `src/app/features/analytics/call-center/call-center.component.html` |
| Filter shell | `src/app/features/analytics/call-center/filter-shell/call-center-filter-shell.component.ts` |
| Call-details filter shell | `src/app/features/analytics/call-center/call-details/filter-shell/call-details-filter-shell.component.ts` |
| Save / Share modals | `src/app/features/analytics/shared/` |

## Page identity

| | |
|---|---|
| Saved-view `sourcePage` | `call-center` |
| Help URL | `https://help.onflo.com/analytics/call-center` |
| Base route | `/analytics/call-center` |
| Saved-view route | `/analytics/call-center/saved-views/:id` |

## Tabs

Six tabs. Each maps to its own filter context:

| Tab | Filter context | Layout |
|---|---|---|
| Overview | `call-center-overview` | Dashboard |
| Queue Management | `call-center-queue-management` | Dashboard |
| CSAT | `call-center-csat` | Dashboard |
| Call Metrics | `call-center-call-metrics` | Dashboard |
| Call Details | `call-center-call-details` | **Table** (`ds-page-content__main--table`) |
| Agent Status | `call-center-agent-status` | **Table** (`ds-page-content__main--table`) |

Filter context is a `computed()` signal in the component:

```ts
filterContext = computed(() => {
  const map: Record<CallCenterTab, string> = {
    'overview':         'call-center-overview',
    'queue-management': 'call-center-queue-management',
    'csat':             'call-center-csat',
    'call-metrics':     'call-center-call-metrics',
    'call-details':     'call-center-call-details',
    'agent-status':     'call-center-agent-status',
  };
  return map[this.activeTab()];
});
```

There are derived signals on the component:

```ts
isCallDetailsTab     = computed(() => this.activeTab() === 'call-details');
isAgentStatusTab     = computed(() => this.activeTab() === 'agent-status');
isTableTab           = computed(() => this.isCallDetailsTab() || this.isAgentStatusTab());
isQueueManagementTab = computed(() => this.activeTab() === 'queue-management');
```

These drive the layout switch (table vs. dashboard canvas) and any per-tab toolbar
adjustments.

## Toolbar variants per tab

- **Overview / CSAT / Call Metrics:** standard dashboard toolbar (date, filter, Save View, Download, Share)
- **Call Details / Agent Status:** standard dashboard toolbar with the table layout below it (`ds-page-content__main--table` instead of `--dashboard`)
- **Queue Management:** **the date select is removed** because Queue Management shows
  live queue data — there is no "past tense" to view. Render the toolbar without the
  `ds-dashboard-toolbar__date-select` button on this tab. Filter, Save View, Download,
  and Share remain.

## Required reading

1. `.claude/specs/shared/specs-dashboard.md` — canonical dashboard layout, incl. the
   tabs variant and the `ds-page-content__main--table` canvas variant
2. `.claude/specs/shared/specs-filter-engine.md`
3. `.claude/specs/shared/specs-saved-views.md`
4. `.claude/specs/analytics/specs-service-overview.md` — same-pattern reference page

## Backend dependencies

Cross-cutting analytics endpoints in `specs-saved-views.md`. Each tab has its own
data source on the backend; engineering wires per-tab queries based on the active tab.
