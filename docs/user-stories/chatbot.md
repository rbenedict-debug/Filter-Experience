# Chatbot — user stories

Owner: **Chatbot engineering team**
Format reference: [`./README.md`](./README.md)

## Scope

Stories for the new page header, dashboard toolbar, applied filters bar, and saved-view
integration on the Chatbot page. The chart data and underlying analytics are already in
production and unchanged — engineering integrates the new chrome around the existing
dashboards.

## Roles

- **IT manager** — reviews chatbot performance and reviews chat logs

## How to read this file

Each story inherits the canonical analytics page pattern from Service Overview
(`ANL-SO-1` through `ANL-SO-8` in `docs/user-stories/dashboard.md`). Only Chatbot-specific
deviations are written out here.

| Page | ID prefix |
|---|---|
| Chatbot | `ANL-CB-` |

---

## Epic: Chatbot

Prototype: https://rbenedict-debug.github.io/Filter-Experience/analytics/chatbot
Spec: `.claude/specs/chatbot/specs-chatbot.md`

**Inherits all `ANL-SO-1` through `ANL-SO-8` stories** with these adjustments:
- Filter context varies by tab: `chatbot-overview` (Overview tab) or `chatbot-chat-logs` (Chat Logs tab)
- Saved view `sourcePage` is `chatbot`
- The Optimization tab has no filter; the toolbar is hidden on that tab

### ANL-CB-1 · Switch tabs and have filters apply per tab

**As an** IT manager
**I want** to switch between Overview, Optimization, and Chat Logs and have the filter
modal switch contexts automatically
**So that** each tab's filter set is relevant to the data shown

**Acceptance criteria**

- [ ] The Chatbot page renders three tabs in the header: Overview, Optimization, Chat Logs
- [ ] Switching tabs updates the page's `filterContext()` signal
- [ ] When `filterContext()` changes, the filter shell re-initializes the filter modal with the new context
- [ ] The Optimization tab does not show the toolbar (no date, filter, save-view, etc.)
- [ ] The Chat Logs tab uses a table layout (`ds-page-content__main--table`)
