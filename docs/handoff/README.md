# Engineering handoff

This repository is a design prototype for the Onflo platform, built by the design team.
Three engineering teams will take it from here. Each team owns one feature area.

## The three teams

| Team | Owns | Start here |
|---|---|---|
| Tickets | Inbox, Bookmarks, Drafts, Spam, Saved views | [tickets-team.md](./tickets-team.md) |
| Analytics | Service Overview, Call Center, Chatbot, Comparison, Custom Reports, Fees | [analytics-team.md](./analytics-team.md) |
| Assets | Overview, Asset Views, Standard Views, By Locations / Purchase Order / Users, Actions | [assets-team.md](./assets-team.md) |

Each team's handoff doc tells them exactly which specs to read, where their code lives,
and where to find their user stories.

## Live preview

The current prototype is published to GitHub Pages on every push to `main`:

**https://rbenedict-debug.github.io/Filter-Experience/**

Each team's handoff doc includes deep links into their area of the preview.

## Working with this repo

This is an Angular 21 app on the [Onflo Design System](https://github.com/rbenedict-debug/Design-System).
The design system is consumed as a published GitHub dependency — see `package.json`.

```bash
git clone https://github.com/rbenedict-debug/Filter-Experience.git
cd Filter-Experience
npm install
npm start          # local dev at http://localhost:4200
```

## Working with this repo using Claude Code

The teams will use Claude Code (CLI or web) to implement against this prototype.
The repo is pre-configured for this:

- `CLAUDE.md` at the root loads design-system rules and points at the shared specs
- `.claude/specs/shared/` contains cross-cutting patterns every team reads
- `.claude/specs/{tickets,analytics,assets}/` contains per-team feature specs
- Claude Code automatically loads `CLAUDE.md` and any `@`-imported specs when started
  in this directory

If you're new to Claude Code, install it with `npm install -g @anthropic-ai/claude-code`
then run `claude` in the project root.

## User stories

Stories for each team live in `docs/user-stories/`:

- `docs/user-stories/tickets.md`
- `docs/user-stories/analytics.md`
- `docs/user-stories/assets.md`

PMs and engineers can read these without opening `.claude/`.

## When something is unclear

The design prototype is the source of truth for visual and interaction design.
The specs in `.claude/specs/` are the source of truth for behavior.
If they disagree, raise it with the design team — don't guess.
