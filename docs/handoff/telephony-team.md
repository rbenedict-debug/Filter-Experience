# Telephony team — handoff

## What you're delivering

You're integrating the **filter modal + saved-views experience** plus the **new page
header** and **new dashboard toolbar** into the existing production Call Center
dashboards. The chart data and underlying analytics are already in production — you
are adding/replacing the chrome around them:

1. New page header (title row, last-updated meta, learn-more, **6 tabs**)
2. New dashboard toolbar (date select, filter, Save/Edit View, Download, Share)
3. Applied filters bar
4. Saved-view integration — Save flow, URL routing, load flow, Edit/Delete
5. Two new shared modals: Share Dashboard (same as other pages)

Call Center is the **most complex analytics page** in this handoff — it has 6 tabs
mixing dashboard and table layouts, each with its own filter context.

## Pages in scope

| Page | Route | Spec |
|---|---|---|
| Call Center | `/analytics/call-center` | `specs-call-center.md` |

You also consume the shared modals at `src/app/features/analytics/shared/`:
**save-view-modal**, **share-dashboard-modal**.

## Live preview

**https://rbenedict-debug.github.io/Filter-Experience/analytics/call-center**

Try switching tabs and opening the filter modal — the filter context changes per tab.
Try the Queue Management tab — the date select is absent (live data, no time range).

## Required reading — in this order

**1. Onboarding (everyone reads):**

- [`/CLAUDE.md`](../../CLAUDE.md) — project-wide rules and Angular conventions
- [`/README.md`](../../README.md) — local setup
- [`docs/handoff/README.md`](./README.md) — handoff overview

**2. Shared specs (the meat of the work):**

- [`.claude/specs/shared/specs-dashboard.md`](../../.claude/specs/shared/specs-dashboard.md)
  — **the canonical dashboard layout pattern.** Sticky header, toolbar, applied bar,
  scrolling canvas. Includes the tabs variant and the table-tab variant. Read first.
- [`.claude/specs/shared/specs-filter-engine.md`](../../.claude/specs/shared/specs-filter-engine.md)
  — the entire filter modal.
- [`.claude/specs/shared/specs-saved-views.md`](../../.claude/specs/shared/specs-saved-views.md)
  — saved-view storage, routing, and load flow.

**3. Reference and per-page spec:**

- [`.claude/specs/dashboard/specs-service-overview.md`](../../.claude/specs/dashboard/specs-service-overview.md)
  — read once as the same-pattern reference; Call Center follows its saved-view and toolbar pattern.
- [`.claude/specs/telephony/specs-call-center.md`](../../.claude/specs/telephony/specs-call-center.md)
  — the Call Center spec. Read after the shared specs and the reference.

## User stories

Stories live at [`docs/user-stories/telephony.md`](../user-stories/telephony.md) — one
epic for Call Center. Engineering reviews acceptance criteria before sprint planning.

## How to work with this prototype using Claude Code

Run `claude` in the project root. Claude auto-loads `CLAUDE.md`, the design-system
guide, and the shared specs. When you start on Call Center:

```
Read .claude/specs/telephony/specs-call-center.md, then implement story ANL-CC-1.
```

## What is **not** in scope for this team

- The chart data and chart logic itself — already in production, unchanged
- The app shell (top nav, sidebar, agent status)
- Anything under `src/app/features/{tickets,assets,settings}`
- Service Overview, Comparison, Custom Reports, Chatbot, and Fees (owned by Dashboard, Chatbot, and Assets teams)

If you find a bug or a gap that crosses into one of these, file it; don't fix it.

## Backend dependencies

The prototype uses in-memory state and `localStorage`. Production needs:

- A saved-views API for analytics (`/api/analytics/saved-views`) — see endpoint
  sketches in `.claude/specs/shared/specs-saved-views.md`
- A saved-filter-sets API for the filter engine's internal sets (currently in
  localStorage) — see migration plan in `.claude/specs/shared/specs-filter-engine.md`
- Per-tab data sources on the backend — engineering wires per-tab queries based on
  the active tab (see `specs-call-center.md` tab table)

Coordinate with the backend team early — the saved-views API is blocking for
integration work.
