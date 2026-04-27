import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tickets',
    pathMatch: 'full',
  },

  // ── Tickets ──────────────────────────────────────────────────────────────
  {
    path: 'tickets',
    loadComponent: () =>
      import('./features/tickets/tickets.component').then(m => m.TicketsComponent),
    children: [
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./features/tickets/inbox/inbox.component').then(m => m.InboxComponent),
      },
      {
        path: 'bookmarks',
        loadComponent: () =>
          import('./features/tickets/bookmarks/bookmarks.component').then(m => m.BookmarksComponent),
      },
      {
        path: 'spam',
        loadComponent: () =>
          import('./features/tickets/spam/spam.component').then(m => m.SpamComponent),
      },
      {
        path: 'drafts',
        loadComponent: () =>
          import('./features/tickets/drafts/drafts.component').then(m => m.DraftsComponent),
      },
    ],
  },

  // ── Assets ───────────────────────────────────────────────────────────────
  {
    path: 'assets',
    loadComponent: () =>
      import('./features/assets/assets.component').then(m => m.AssetsComponent),
    children: [
      { path: '', redirectTo: 'asset-views', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/assets/overview/overview.component').then(m => m.OverviewComponent),
      },
      {
        path: 'asset-views',
        loadComponent: () =>
          import('./features/assets/asset-views/asset-views.component').then(m => m.AssetViewsComponent),
      },
      {
        path: 'actions',
        loadComponent: () =>
          import('./features/assets/actions/actions.component').then(m => m.ActionsComponent),
      },
    ],
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  {
    path: 'analytics',
    loadComponent: () =>
      import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
    children: [
      { path: '', redirectTo: 'service-overview', pathMatch: 'full' },
      {
        path: 'service-overview',
        loadComponent: () =>
          import('./features/analytics/service-overview/service-overview.component').then(m => m.ServiceOverviewComponent),
      },
      {
        path: 'chatbot',
        loadComponent: () =>
          import('./features/analytics/chatbot/chatbot.component').then(m => m.ChatbotComponent),
      },
      {
        path: 'call-center',
        loadComponent: () =>
          import('./features/analytics/call-center/call-center.component').then(m => m.CallCenterComponent),
      },
      {
        path: 'custom-reports',
        loadComponent: () =>
          import('./features/analytics/custom-reports/custom-reports.component').then(m => m.CustomReportsComponent),
      },
      {
        path: 'fees',
        loadComponent: () =>
          import('./features/analytics/fees/fees.component').then(m => m.FeesComponent),
      },
      {
        path: 'comparison/users',
        loadComponent: () =>
          import('./features/analytics/comparison/users/comparison-users.component').then(m => m.ComparisonUsersComponent),
      },
      {
        path: 'comparison/categories',
        loadComponent: () =>
          import('./features/analytics/comparison/categories/comparison-categories.component').then(m => m.ComparisonCategoriesComponent),
      },
      {
        path: 'comparison/topics',
        loadComponent: () =>
          import('./features/analytics/comparison/topics/comparison-topics.component').then(m => m.ComparisonTopicsComponent),
      },
      {
        path: 'saved-views/:id',
        loadComponent: () =>
          import('./features/analytics/service-overview/service-overview.component').then(m => m.ServiceOverviewComponent),
      },
    ],
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(m => m.SettingsComponent),
    children: [
      { path: '', redirectTo: 'district-profile', pathMatch: 'full' },

      // Global
      {
        path: 'district-profile',
        loadComponent: () =>
          import('./features/settings/global/district-profile/district-profile.component').then(m => m.DistrictProfileComponent),
      },
      {
        path: 'activity-log/onflo',
        loadComponent: () =>
          import('./features/settings/global/activity-log-onflo/activity-log-onflo.component').then(m => m.ActivityLogOnfloComponent),
      },
      {
        path: 'activity-log/assets',
        loadComponent: () =>
          import('./features/settings/global/activity-log-assets/activity-log-assets.component').then(m => m.ActivityLogAssetsComponent),
      },
      {
        path: 'ai-training',
        loadComponent: () =>
          import('./features/settings/global/ai-training/ai-training.component').then(m => m.AiTrainingComponent),
      },
      {
        path: 'chatbot',
        loadComponent: () =>
          import('./features/settings/global/chatbot/settings-chatbot.component').then(m => m.SettingsChatbotComponent),
      },
      {
        path: 'cs-score-templates',
        loadComponent: () =>
          import('./features/settings/global/cs-score-templates/cs-score-templates.component').then(m => m.CsScoreTemplatesComponent),
      },
      {
        path: 'email',
        loadComponent: () =>
          import('./features/settings/global/email/email.component').then(m => m.EmailComponent),
      },
      {
        path: 'response-templates',
        loadComponent: () =>
          import('./features/settings/global/response-templates/response-templates.component').then(m => m.ResponseTemplatesComponent),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/settings/global/departments/departments.component').then(m => m.DepartmentsComponent),
      },
      {
        path: 'keyword-alerts',
        loadComponent: () =>
          import('./features/settings/global/keyword-alerts/keyword-alerts.component').then(m => m.KeywordAlertsComponent),
      },
      {
        path: 'languages',
        loadComponent: () =>
          import('./features/settings/global/languages/languages.component').then(m => m.LanguagesComponent),
      },
      {
        path: 'live-agent',
        loadComponent: () =>
          import('./features/settings/global/live-agent/live-agent.component').then(m => m.LiveAgentComponent),
      },
      {
        path: 'locations',
        loadComponent: () =>
          import('./features/settings/global/locations/locations.component').then(m => m.LocationsComponent),
      },
      {
        path: 'tags/tickets',
        loadComponent: () =>
          import('./features/settings/global/tags-tickets/tags-tickets.component').then(m => m.TagsTicketsComponent),
      },
      {
        path: 'tags/assets',
        loadComponent: () =>
          import('./features/settings/global/tags-assets/tags-assets.component').then(m => m.TagsAssetsComponent),
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./features/settings/global/user-management/user-management.component').then(m => m.UserManagementComponent),
      },

      // Integration Hub
      {
        path: 'api-tokens',
        loadComponent: () =>
          import('./features/settings/integration-hub/api-tokens/api-tokens.component').then(m => m.ApiTokensComponent),
      },
      {
        path: 'webhooks',
        loadComponent: () =>
          import('./features/settings/integration-hub/webhooks/webhooks.component').then(m => m.WebhooksComponent),
      },
      {
        path: 'marketplace',
        loadComponent: () =>
          import('./features/settings/integration-hub/marketplace/marketplace.component').then(m => m.MarketplaceComponent),
      },
      {
        path: 'installed-apps',
        loadComponent: () =>
          import('./features/settings/integration-hub/installed-apps/installed-apps.component').then(m => m.InstalledAppsComponent),
      },

      // Workflows
      {
        path: 'workflows/tickets',
        loadComponent: () =>
          import('./features/settings/workflows/tickets/workflows-tickets.component').then(m => m.WorkflowsTicketsComponent),
      },
      {
        path: 'workflows/assets',
        loadComponent: () =>
          import('./features/settings/workflows/assets/workflows-assets.component').then(m => m.WorkflowsAssetsComponent),
      },
      {
        path: 'workflows/lookup-tables',
        loadComponent: () =>
          import('./features/settings/workflows/lookup-tables/lookup-tables.component').then(m => m.LookupTablesComponent),
      },

      // Tickets Settings
      {
        path: 'portals/it-service',
        loadComponent: () =>
          import('./features/settings/tickets/portals-it-service/portals-it-service.component').then(m => m.PortalsItServiceComponent),
      },
      {
        path: 'portals/landing-page',
        loadComponent: () =>
          import('./features/settings/tickets/portals-landing-page/portals-landing-page.component').then(m => m.PortalsLandingPageComponent),
      },
      {
        path: 'forms',
        loadComponent: () =>
          import('./features/settings/tickets/forms/forms.component').then(m => m.FormsComponent),
      },
      {
        path: 'saved-exports',
        loadComponent: () =>
          import('./features/settings/tickets/saved-exports/saved-exports.component').then(m => m.SavedExportsComponent),
      },
      {
        path: 'slas',
        loadComponent: () =>
          import('./features/settings/tickets/slas/slas.component').then(m => m.SlasComponent),
      },
      {
        path: 'ticket-schedules',
        loadComponent: () =>
          import('./features/settings/tickets/ticket-schedules/ticket-schedules.component').then(m => m.TicketSchedulesComponent),
      },
      {
        path: 'topics',
        loadComponent: () =>
          import('./features/settings/tickets/topics/topics.component').then(m => m.TopicsComponent),
      },
      {
        path: 'success-messages',
        loadComponent: () =>
          import('./features/settings/tickets/success-messages/success-messages.component').then(m => m.SuccessMessagesComponent),
      },

      // Assets Settings
      {
        path: 'archived-assets',
        loadComponent: () =>
          import('./features/settings/assets-settings/archived-assets/archived-assets.component').then(m => m.ArchivedAssetsComponent),
      },
      {
        path: 'asset-fields',
        loadComponent: () =>
          import('./features/settings/assets-settings/asset-fields/asset-fields.component').then(m => m.AssetFieldsComponent),
      },
      {
        path: 'asset-hierarchy',
        loadComponent: () =>
          import('./features/settings/assets-settings/asset-hierarchy/asset-hierarchy.component').then(m => m.AssetHierarchyComponent),
      },
      {
        path: 'funding-sources',
        loadComponent: () =>
          import('./features/settings/assets-settings/funding-sources/funding-sources.component').then(m => m.FundingSourcesComponent),
      },
      {
        path: 'manufacturers',
        loadComponent: () =>
          import('./features/settings/assets-settings/manufacturers/manufacturers.component').then(m => m.ManufacturersComponent),
      },
      {
        path: 'models',
        loadComponent: () =>
          import('./features/settings/assets-settings/models/models.component').then(m => m.ModelsComponent),
      },
      {
        path: 'purchase-order-details',
        loadComponent: () =>
          import('./features/settings/assets-settings/purchase-order-details/purchase-order-details.component').then(m => m.PurchaseOrderDetailsComponent),
      },
      {
        path: 'statuses',
        loadComponent: () =>
          import('./features/settings/assets-settings/statuses/statuses.component').then(m => m.StatusesComponent),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/settings/assets-settings/suppliers/suppliers.component').then(m => m.SuppliersComponent),
      },

      // Call Center Settings
      {
        path: 'business-hours',
        loadComponent: () =>
          import('./features/settings/call-center/business-hours/business-hours.component').then(m => m.BusinessHoursComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/settings/call-center/calendar/calendar.component').then(m => m.CalendarComponent),
      },
      {
        path: 'call-notes',
        loadComponent: () =>
          import('./features/settings/call-center/call-notes/call-notes.component').then(m => m.CallNotesComponent),
      },
      {
        path: 'contact-numbers',
        loadComponent: () =>
          import('./features/settings/call-center/contact-numbers/contact-numbers.component').then(m => m.ContactNumbersComponent),
      },
      {
        path: 'greetings',
        loadComponent: () =>
          import('./features/settings/call-center/greetings/greetings.component').then(m => m.GreetingsComponent),
      },
      {
        path: 'ivr',
        loadComponent: () =>
          import('./features/settings/call-center/ivr/ivr.component').then(m => m.IvrComponent),
      },
      {
        path: 'queues',
        loadComponent: () =>
          import('./features/settings/call-center/queues/queues.component').then(m => m.QueuesComponent),
      },
      {
        path: 'texting',
        loadComponent: () =>
          import('./features/settings/call-center/texting/texting.component').then(m => m.TextingComponent),
      },
    ],
  },
];
