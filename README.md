# Onflo Project Template

Starting point for all Onflo Angular + .NET Core projects.
Includes the full platform shell (top nav, sidebar, routing) with the design system pre-wired.

---

## Getting started

**Step 1 — Clone this template**

On GitHub, click **"Use this template"** to create your own repo from this template.
Then clone your new repo locally.

**Step 2 — Install dependencies**

Requires SSH access to the Onflo GitHub. See [SETUP.md in the Design System repo](https://github.com/rbenedict-debug/Design-System/blob/main/SETUP.md) if you haven't done this yet.

```bash
npm install
```

**Step 3 — Start the dev server**

```bash
npm start
```

Open `http://localhost:4200`. You should see the full Onflo platform shell.

**Step 4 — Start Claude Code**

```bash
claude
```

Claude loads the design system rules automatically. Start building.

---

## What's included

- Full platform shell: top nav, sidebar (Tickets, Assets, Analytics, Settings), agent status
- Design system tokens wired into `angular.json`
- Angular animations, routing, and Angular Material pre-configured
- Lazy-loaded feature routes for all four main sections
- `CLAUDE.md` pre-configured — Claude knows the design system and project structure from the first session

---

## Project structure

```
src/
  app/
    features/        ← add your feature components here
      tickets/
      assets/
      analytics/
      settings/
    core/
      services/      ← API services go here
  styles.scss        ← global base styles only
```

---

## Getting design system updates

When Rebecca pushes design system updates:

```bash
npm update @onflo/design-system
```

Restart Claude Code after updating. It picks up new component definitions immediately.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 (standalone components) |
| Backend | .NET Core |
| Design System | @onflo/design-system |
| Token format | CSS custom properties |
| State | Angular signals |
| Routing | Angular Router (lazy-loaded) |
