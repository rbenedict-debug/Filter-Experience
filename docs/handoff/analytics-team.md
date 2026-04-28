# Analytics team — handoff

## What you're delivering

You're integrating the **filter modal + saved-views experience** plus the **new page
header** and **new dashboard toolbar** into the existing production analytics
dashboards. The chart data, chart configurations, and underlying analytics function
are already in production — you are **not** rebuilding the dashboards. You're
adding/replacing the chrome around them:

1. New page header (title row, last-updated meta, learn-more, tabs/stats where applicable)
2. New dashboard toolbar (date select, filter, Save/Edit View, Download, Share)
3. Applied filters bar
4. Saved-view integration — Save flow, URL routing, load flow, Edit/Delete
5. Saved views in the Analytics subnav (already in `app.component.html`)
6. Two new shared modals: Share Dashboard and Notify Users

## Pages in scope

| Page | Route | Spec |
|---|---|---|
| Service Overview | `/analytics/service-overview` | `specs-service-overview.md` |
| Chatbot | `/analytics/chatbot` | `specs-chatbot.md` |
| Call Center | `/analytics/call-center` | `specs-call-center.md` |
| Custom Reports | `/analytics/custom-reports` | `specs-custom-reports.md` |
| Fees | `/analytics/fees` | `specs-fees.md` |
| Comparison · Users | `/analytics/comparison/users` | `specs-comparison-users.md` |
| Comparison · Categories | `/analytics/comparison/categories` | `specs-comparison-categories.md` |
| Comparison · Topics | `/analytics/comparison/topics` | `specs-comparison-topics.md` |

You also own the cross-page modals at `src/app/features/analytics/shared/`:
**save-view-modal**, **share-dashboard-modal**, **notify-users-modal**.

## Live preview

Service Overview is the canonical reference — every other page follows its pattern
with page-specific tweaks (tabs, stats, extra buttons):

**https://rbenedict-debug.github.io/Filter-Experience/analytics/service-overview**

Try the full saved-view flow: open the filter modal, apply some filters, click
**Save View**, give it a name, watch the URL change to `/saved-views/:id`, see the
new view in the subnav, click it to navigate back to it (state restores).

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
  — the entire filter modal. The whole engine is in scope for engineering.
- [`.claude/specs/shared/specs-saved-views.md`](../../.claude/specs/shared/specs-saved-views.md)
  — saved-view storage, routing, and load flow. Analytics is the primary surface.

**3. Per-page specs:**

- [`.claude/specs/analytics/specs-service-overview.md`](../../.claude/specs/analytics/specs-service-overview.md)
  — read this once. Other per-page specs reference back to it.
- Then the per-page spec for whichever page you're starting on.

## User stories

Stories live at [`docs/user-stories/analytics.md`](../user-stories/analytics.md) — one
epic per page. The design/PM team owns filling in the bodies; engineering reviews
acceptance criteria before sprint planning.

## How to work with this prototype using Claude Code

Run `claude` in the project root. Claude auto-loads `CLAUDE.md`, the design-system
guide, and the shared specs. When you start on a specific page, ask Claude to also
read that page's per-page spec — for example:

```
Read .claude/specs/analytics/specs-call-center.md, then implement story ANL-12.
```

## What is **not** in scope for this team

- The chart data and chart logic itself — already in production, unchanged
- The app shell (top nav, sidebar, agent status)
- Anything under `src/app/features/{tickets,assets,settings}`

If you find a bug or a gap that crosses into one of these, file it; don't fix it.

## Backend dependencies

The prototype uses in-memory state and `localStorage`. Production needs:

- A saved-views API for analytics (`/api/analytics/saved-views`) — see endpoint
  sketches in `.claude/specs/shared/specs-saved-views.md`
- A saved-filter-sets API for the filter engine's internal sets (currently in
  localStorage) — see migration plan in `.claude/specs/shared/specs-filter-engine.md`
- Stats-bar endpoints for Service Overview and Comparison pages (see those specs)
- A cohort-message endpoint for the Notify Users modal on Comparison pages

Coordinate with the backend team early — these are blocking for the integration work.
