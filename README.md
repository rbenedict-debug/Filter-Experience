# Onflo Project Template

Starting point for all Onflo Angular + .NET Core projects.
Includes the full platform shell (top nav, sidebar, routing) with the design system pre-wired.

---

## Preview URL

A live preview of `main` and active feature branches is published to GitHub Pages on every push:

**https://rbenedict-debug.github.io/Filter-Experience/**

The deployment is driven by `.github/workflows/deploy-preview.yml`. To enable it the first time,
in the GitHub repo go to **Settings → Pages → Build and deployment → Source → GitHub Actions**.

---

## Getting started

**Step 1 — Clone this template**

On GitHub, click **"Use this template"** to create your own repo from this template.
Then clone your new repo locally.

**Step 2 — Install dependencies**

```bash
npm install
```

The design system is bundled directly in this template — no additional access or setup required.

> **If you get an `EACCES` permission error** pointing to `~/.npm/_cacache`, your npm cache has root-owned files from a previous `sudo npm` run. Fix it once with:
> ```bash
> sudo chown -R $(id -u):$(id -g) ~/.npm
> ```
> Then re-run `npm install` normally.

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

When Rebecca releases a new design system version she will send you a new `.tgz` file.

**Step 1 — Replace the file in your project**

Drop the new `.tgz` file into your project's `vendor/` folder, replacing the old one.

**Step 2 — Update `package.json`**

Open `package.json` and update the filename in the design system line to match the new file:

```json
"@onflo/design-system": "file:./vendor/onflo-design-system-0.2.0.tgz"
```

**Step 3 — Reinstall**

```bash
npm install
```

**Step 4 — Restart Claude Code**

If Claude Code is running, restart it. It picks up the new component definitions immediately.

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
