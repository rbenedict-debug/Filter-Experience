# Telephony — user stories

Owner: **Telephony engineering team**
Format reference: [`./README.md`](./README.md)

## Scope

Stories for the new page header, dashboard toolbar, applied filters bar, and saved-view
integration on the Call Center page. The chart data and underlying analytics are already
in production and unchanged — engineering integrates the new chrome around the existing
dashboards.

## Roles

- **IT manager** — reviews call center performance, queue management, and agent status

## How to read this file

Each story inherits the canonical analytics page pattern from Service Overview
(`ANL-SO-1` through `ANL-SO-8` in `docs/user-stories/dashboard.md`). Only Call
Center–specific deviations are written out here.

| Page | ID prefix |
|---|---|
| Call Center | `ANL-CC-` |

---

## Epic: Call Center

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/call-center
Spec: `.claude/specs/telephony/specs-call-center.md`

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
