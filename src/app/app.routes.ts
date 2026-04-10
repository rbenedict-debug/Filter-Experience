import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tickets',
    pathMatch: 'full',
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import('./features/tickets/tickets.component').then(m => m.TicketsComponent),
  },
  {
    path: 'assets',
    loadComponent: () =>
      import('./features/assets/assets.component').then(m => m.AssetsComponent),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(m => m.SettingsComponent),
  },
];
