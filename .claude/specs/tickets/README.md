# Tickets specs

Per-feature behavior specs owned by the **Tickets** engineering team.

## What this team is delivering

Only the filter + saved-views experience for the Tickets section is being handed off.
The existing pages (Inbox, Bookmarks, Drafts, Spam) are already in production and are
not part of this handoff. Engineering integrates the prototype's filter modal,
applied filters bar, Save View button, and saved-views subnav into the existing
production pages — they are not building those pages from scratch.

## Specs in this folder

- `specs-inbox.md` — filter, applied bar, Save View, and subnav saved-views integration for the Inbox

The saved-view detail route (`/tickets/saved-views/:id`) is documented in the shared
saved-views spec (`.claude/specs/shared/specs-saved-views.md`), since the load flow is
identical for analytics and tickets.

## Required reading

In order:

1. `CLAUDE.md` — project rules and Angular conventions
2. `.claude/specs/shared/specs-filter-engine.md` — the entire filter modal (in scope for engineering)
3. `.claude/specs/shared/specs-saved-views.md` — saved-view storage, routing, and load flow
4. `.claude/specs/tickets/specs-inbox.md` — the per-page integration spec
