# User stories

Engineering stories grouped by team. Each team file is organized by **epic**
(one epic per page in the prototype) with **stories** under each epic.

## Format

Every story follows this shape:

```markdown
### TICK-1 · Inbox loads with default filter

**As an** agent
**I want** the inbox to open with my default saved view applied
**So that** I see the tickets that matter to me without configuring it each time

**Acceptance criteria**

- [ ] Inbox renders within 1 second on a warm cache
- [ ] Default view is the user's last-applied saved view, not a hardcoded list
- [ ] Filter chips reflect the active view's filters
- [ ] Empty result state matches the prototype's empty state

**Reference**

- Prototype: `https://rbenedict-debug.github.io/Filter-Experience/tickets/inbox`
- Spec: `.claude/specs/tickets/specs-inbox.md` § Default state
- Design: [Figma frame URL]
```

**Story IDs** use a team prefix:

| Team | Prefix | Example |
|---|---|---|
| Tickets | `TICK-` | `TICK-1` |
| Analytics | `ANL-` | `ANL-1` |
| Assets | `AST-` | `AST-1` |

Numbers are sequential across all epics within a team — they don't reset per epic.

## Files

- [`tickets.md`](./tickets.md)
- [`analytics.md`](./analytics.md)
- [`assets.md`](./assets.md)
