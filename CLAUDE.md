# Onflo Project — Claude Working Rules

This is an Angular + .NET Core project built on the Onflo Design System.
Always follow these rules before writing any code.

---

## Design System

This project uses the Onflo Design System for all UI.
Load the full component and token rules now:

@node_modules/@onflo/design-system/AGENT-GUIDE.md

---

## Project structure

```
src/
  app/
    features/          ← one folder per product area
      tickets/         ← tickets feature
      assets/          ← assets feature
      analytics/       ← analytics feature
      settings/        ← settings feature
    core/
      services/        ← API services and shared business logic
  styles.scss          ← global base styles only, no component styles
  index.html           ← app shell HTML
```

### Adding a new feature

1. Create `src/app/features/{feature-name}/`
2. Add the component files inside it (`.ts`, `.html`, `.scss`)
3. Add a lazy-loaded route in `src/app/app.routes.ts`
4. Add a nav button in `app.component.html` if it needs top-level navigation

### Adding a new page within a feature

Create sub-components inside the feature folder:
```
src/app/features/tickets/
  tickets.component.ts       ← feature root (already exists)
  ticket-list/
    ticket-list.component.ts
  ticket-detail/
    ticket-detail.component.ts
```

---

## Angular conventions

- **Standalone components only** — never use NgModule
- **OnPush change detection** on every component — always
- **Angular signals** for reactive state — use `signal()`, `computed()`, `effect()`
- **Lazy loading** for all feature routes — use `loadComponent` in app.routes.ts
- **No inline styles** — component styles go in the `.scss` file only
- **No hardcoded values** — all colors, spacing, typography use design tokens

---

## .NET Core API integration

API calls go through services in `src/app/core/services/`.
Never call APIs directly from components.

```typescript
// Example service pattern
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getTickets() {
    return this.http.get(`${this.baseUrl}/api/tickets`);
  }
}
```

Add `provideHttpClient()` to `app.config.ts` when you first need API calls.

---

## Shell — what not to change

The app shell in `app.component.html` and `app.component.ts` is pre-built.
Do not modify the nav-sidebar, top-nav, or page-layout structure unless
specifically asked to.

The profile button initials, notification badge count, and agent status
should be wired to real services when building out those features.

---

## What to do when a design system component doesn't exist

If the UI you need has no matching component in the design system:
1. Build it as a local component in `src/app/features/{name}/`
2. Use design tokens for all visual values — no exceptions
3. Note it as a candidate for the design system

Tokens are always required. Components are required when they exist.
