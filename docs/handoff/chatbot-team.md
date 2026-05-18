# Chatbot team — handoff

## What you're delivering

You're integrating the **filter modal + saved-views experience** plus the **new page
header** and **new dashboard toolbar** into the existing production Chatbot
dashboards. The chart data and underlying analytics are already in production — you
are adding/replacing the chrome around them:

1. New page header (title row, last-updated meta, learn-more, **3 tabs**)
2. New dashboard toolbar (date select, filter, Save/Edit View, Download, Share)
3. Applied filters bar
4. Saved-view integration — Save flow, URL routing, load flow, Edit/Delete
5. Shared modals: Share Dashboard

Chatbot has 3 tabs with different filter contexts and layouts. The **Optimization tab**
has no filter or toolbar — its tab has its own UI that remains unchanged.

## Pages in scope

| Page | Route | Spec |
|---|---|---|
| Chatbot | `/analytics/chatbot` | `specs-chatbot.md` |

You also consume the shared modals at `src/app/features/analytics/shared/`:
**save-view-modal**, **share-dashboard-modal**.

## Live preview

**https://rbenedict-debug.github.io/Filter-Experience/analytics/chatbot**

Try switching between Overview, Optimization, and Chat Logs — note that Optimization
hides the toolbar entirely. The Chat Logs tab uses a table layout.

## Required reading — in this order

**1. Onboarding (everyone reads):**

- [`/CLAUDE.md`](../../CLAUDE.md) — project-wide rules and Angular conventions
- [`/README.md`](../../README.md) — local setup
- [`docs/handoff/README.md`](./README.md) — handoff overview

**2. Shared specs (the meat of the work):**

- [`.claude/specs/shared/specs-dashboard.md`](../../.claude/specs/shared/specs-dashboard.md)
  — **the canonical dashboard layout pattern.** Sticky header, toolbar, applied bar,
  scrolling canvas. Includes the tabs variant. Read first.
- [`.claude/specs/shared/specs-filter-engine.md`](../../.claude/specs/shared/specs-filter-engine.md)
  — the entire filter modal.
- [`.claude/specs/shared/specs-saved-views.md`](../../.claude/specs/shared/specs-saved-views.md)
  — saved-view storage, routing, and load flow.

**3. Reference and per-page spec:**

- [`.claude/specs/dashboard/specs-service-overview.md`](../../.claude/specs/dashboard/specs-service-overview.md)
  — read once as the same-pattern reference.
- [`.claude/specs/chatbot/specs-chatbot.md`](../../.claude/specs/chatbot/specs-chatbot.md)
  — the Chatbot spec. Read after the shared specs and the reference.

## User stories

Stories live at [`docs/user-stories/chatbot.md`](../user-stories/chatbot.md) — one
epic for Chatbot. Engineering reviews acceptance criteria before sprint planning.

## How to work with this prototype using Claude Code

Run `claude` in the project root. Claude auto-loads `CLAUDE.md`, the design-system
guide, and the shared specs. When you start on Chatbot:

```
Read .claude/specs/chatbot/specs-chatbot.md, then implement story ANL-CB-1.
```

## What is **not** in scope for this team

- The chart data and chart logic itself — already in production, unchanged
- The Optimization tab's existing UI — unchanged, not part of this handoff
- The app shell (top nav, sidebar, agent status)
- Anything under `src/app/features/{tickets,assets,settings}`
- Service Overview, Comparison, Custom Reports, Call Center, and Fees (owned by Dashboard, Telephony, and Assets teams)

If you find a bug or a gap that crosses into one of these, file it; don't fix it.

## Backend dependencies

The prototype uses in-memory state and `localStorage`. Production needs:

- A saved-views API for analytics (`/api/analytics/saved-views`) — see endpoint
  sketches in `.claude/specs/shared/specs-saved-views.md`
- A saved-filter-sets API for the filter engine's internal sets (currently in
  localStorage) — see migration plan in `.claude/specs/shared/specs-filter-engine.md`

No chatbot-specific endpoints are needed beyond the existing dashboard data sources
already in production.
