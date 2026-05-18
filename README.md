# Onflo Filter Experience — Engineering Handoff

This is the design prototype for the Onflo filter modal, saved views, and dashboard toolbar
experience. Five engineering teams will implement against this prototype. Each team owns one
feature area and has its own handoff doc.

---

## Teams and handoff docs

| Team | Owns | Handoff doc |
|---|---|---|
| Tickets | Inbox, Bookmarks, Drafts, Spam, Saved views | [docs/handoff/tickets-team.md](docs/handoff/tickets-team.md) |
| Dashboard | Service Overview, Comparison, Custom Reports | [docs/handoff/dashboard-team.md](docs/handoff/dashboard-team.md) |
| Telephony | Call Center | [docs/handoff/telephony-team.md](docs/handoff/telephony-team.md) |
| Chatbot | Chatbot | [docs/handoff/chatbot-team.md](docs/handoff/chatbot-team.md) |
| Assets | Asset Views, By Locations/Users/Purchase Order, Fees | [docs/handoff/assets-team.md](docs/handoff/assets-team.md) |

Start with your team's handoff doc — it tells you exactly which specs to read and where your code lives.

---

## Live preview

A live preview of `main` is published to GitHub Pages on every push:

**https://rbenedict-debug.github.io/Filter-Experience/**

Each team's handoff doc includes deep links to their area of the preview.

---

## Getting started

**Step 1 — Clone this repo**

```bash
git clone https://github.com/rbenedict-debug/Filter-Experience.git
cd Filter-Experience
```

**Step 2 — Install dependencies**

```bash
npm install
```

The design system is installed directly from the [Onflo Design System GitHub repo](https://github.com/rbenedict-debug/Design-System) — no local files or extra access required.

> **If you get an `EACCES` permission error** pointing to `~/.npm/_cacache`, your npm cache has root-owned files from a previous `sudo npm` run. Fix it once with:
> ```bash
> sudo chown -R $(id -u):$(id -g) ~/.npm
> ```
> Then re-run `npm install` normally.

**Step 3 — Start the dev server**

```bash
npm start
```

Open `http://localhost:4200`.

**Step 4 — Start Claude Code**

```bash
claude
```

Claude loads the project rules and design system guide automatically from `CLAUDE.md`. Start by
telling it which page you're working on and asking it to read your team's spec — for example:

```
Read .claude/specs/telephony/specs-call-center.md, then implement story ANL-CC-1.
```

---

## Project structure

```
src/
  app/
    features/
      tickets/       ← Tickets team
      assets/        ← Assets team (includes Fees at analytics/fees/)
      analytics/     ← Dashboard, Telephony, and Chatbot teams
    core/
      services/      ← API services
  assets/
    filter-proto/    ← vanilla JS filter engine (read specs-filter-engine.md before touching this)
```

```
.claude/specs/
  shared/            ← all teams read this
  dashboard/         ← Dashboard team specs
  telephony/         ← Telephony team specs
  chatbot/           ← Chatbot team specs
  assets/            ← Assets team specs
  tickets/           ← Tickets team specs

docs/
  handoff/           ← one doc per team (start here)
  user-stories/      ← one file per team
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 (standalone components) |
| Backend | .NET Core |
| Design System | [@onflo/design-system](https://github.com/rbenedict-debug/Design-System) |
| Token format | CSS custom properties |
| State | Angular signals |
| Routing | Angular Router (lazy-loaded) |
