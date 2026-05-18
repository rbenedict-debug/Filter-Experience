# Tickets team — handoff

## What you're delivering

You're integrating the **filter modal + saved-views experience** into the existing
production Tickets section. The Inbox, Bookmarks, Drafts, and Spam pages are
already in production — you are **not** rebuilding them. You're adding four pieces:

1. Wiring the filter button to the filter modal (per-page filter context)
2. The applied filters bar below the toolbar
3. The Save View button in the toolbar
4. Saved views in the Tickets subnav (and the saved-view detail route)

For the Tickets section, only the **Inbox** has these added in v1. Bookmarks, Drafts,
and Spam are out of scope for this handoff.

## Live preview

Open the prototype's inbox to see the target behavior:

**https://rbenedict-debug.github.io/Filter-Experience/tickets/inbox**

Try: open the filter modal, apply some filters, see the applied filters bar, click
Save View, see the saved view in the subnav, click it to reload that saved state.

## Required reading — in this order

**1. Onboarding (everyone reads):**

- [`/CLAUDE.md`](../../CLAUDE.md) — project-wide rules and Angular conventions
- [`/README.md`](../../README.md) — local setup
- [`docs/handoff/README.md`](./README.md) — handoff overview

**2. Shared specs (the meat of the work):**

- [`.claude/specs/shared/specs-filter-engine.md`](../../.claude/specs/shared/specs-filter-engine.md)
  — the entire filter modal. **The whole engine is in scope for engineering** — this
  spec is comprehensive and the source of truth for filter behavior.
- [`.claude/specs/shared/specs-saved-views.md`](../../.claude/specs/shared/specs-saved-views.md)
  — saved view storage, routing, and load flow. The save / load round-trip works the
  same for analytics and tickets.

**3. Per-page integration spec:**

- [`.claude/specs/tickets/specs-inbox.md`](../../.claude/specs/tickets/specs-inbox.md)
  — exactly which markup goes where on the inbox page

## User stories

Stories live at [`docs/user-stories/tickets.md`](../user-stories/tickets.md) — one
epic per page. Currently only the Inbox epic has stories; the design/PM team owns
filling in the rest.

## How to work with this prototype using Claude Code

Run `claude` in the project root. Claude auto-loads `CLAUDE.md`, the design-system
guide, and the shared specs. When you start work on the Inbox integration, ask Claude
to also read the per-page spec — for example:

```
Read .claude/specs/tickets/specs-inbox.md, then implement story TICK-3.
```

If you need to extend the filter modal (new context, new field type), Claude already
knows the engine from the shared spec. Tell it what you want to add and have it
follow the patterns there.

## What is **not** in scope for this team

- The existing Tickets pages themselves (Inbox tabs, search, settings panel, table) — those are in production
- The Bookmarks, Drafts, and Spam pages (no filter/saved-view integration in v1)
- The app shell (top nav, sidebar, agent status)
- Anything under `src/app/features/{analytics,assets,settings}`

If you find a bug or a gap that crosses into one of these, file it; don't fix it.

## Backend dependencies

The prototype uses in-memory and localStorage state. Production needs:

- A saved-views API for tickets (`/api/tickets/saved-views`) — see endpoint sketches in
  `.claude/specs/tickets/specs-inbox.md`
- A real-time (or 60s-polling) source for the `ticketCount` badges in the subnav
- A saved-filter-sets API for the engine's internal sets (currently in localStorage) —
  see the migration plan in `.claude/specs/shared/specs-filter-engine.md`

Coordinate with the backend team early — these endpoints are blocking for the integration work.
