import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import {
  NavSidebarComponent,
  TopNavComponent,
  NavButtonComponent,
  AgentStatusComponent,
  NavExpandComponent,
  SubnavButtonComponent,
  SubnavHeaderComponent,
  SubnavSubheaderComponent,
  DsSearchComponent,
  DsTooltipDirective,
  DsNavTabItem,
} from '@onflo/design-system';

type NavSection = 'tickets' | 'assets' | 'analytics' | 'settings';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavSidebarComponent,
    TopNavComponent,
    NavButtonComponent,
    AgentStatusComponent,
    NavExpandComponent,
    SubnavButtonComponent,
    SubnavHeaderComponent,
    SubnavSubheaderComponent,
    DsSearchComponent,
    DsTooltipDirective,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {

  // ── Navigation ───────────────────────────────────────────────────────────

  activeSection = signal<NavSection>('tickets');

  // ── Top nav tabs ─────────────────────────────────────────────────────────
  // Manage open tabs here. Each tab represents an open context (e.g. a ticket,
  // a saved view, a settings page). Add/remove tabs as users navigate.

  tabs = signal<DsNavTabItem[]>([
    { id: 1, label: 'Inbox', active: true },
  ]);

  // ── Sub-nav panel ────────────────────────────────────────────────────────

  subNavOpen = signal<boolean>(true);

  onToggleSubnav(): void {
    this.subNavOpen.update(open => !open);
  }

  // ── Tickets sub-nav ───────────────────────────────────────────────────────

  ticketsNavItem        = signal<string>('inbox');
  savedSearchesExpanded = signal<boolean>(false);

  // ── Assets sub-nav ────────────────────────────────────────────────────────

  assetsNavItem = signal<string>('overview');

  // ── Analytics sub-nav ─────────────────────────────────────────────────────

  analyticsNavItem       = signal<string>('service-overview');
  comparisonExpanded     = signal<boolean>(false);
  savedViewsExpanded     = signal<boolean>(false);

  // ── Settings sub-nav ──────────────────────────────────────────────────────

  settingsNavItem           = signal<string>('district-profile');
  settingsSearchQuery       = signal<string>('');
  globalExpanded            = signal<boolean>(true);
  integrationHubExpanded    = signal<boolean>(false);
  workflowsExpanded         = signal<boolean>(false);
  ticketsSettingsExpanded   = signal<boolean>(false);
  assetsSettingsExpanded    = signal<boolean>(false);
  callCenterExpanded        = signal<boolean>(false);
  activityLogExpanded       = signal<boolean>(false);
  communicationsExpanded    = signal<boolean>(false);
  tagsExpanded              = signal<boolean>(false);
  portalsExpanded           = signal<boolean>(false);
  topicsManagerExpanded     = signal<boolean>(false);

  private readonly _settingsItems = [
    // Global
    { id: 'district-profile',        label: 'District Profile',        section: 'global' },
    { id: 'activity-log',            label: 'Activity Log',            section: 'global' },
    { id: 'activity-log-onflo',      label: 'Onflo',                   section: 'global' },
    { id: 'activity-log-assets',     label: 'Assets',                  section: 'global' },
    { id: 'ai-training',             label: 'AI Training Resources',   section: 'global' },
    { id: 'chatbot',                 label: 'Chatbot',                 section: 'global' },
    { id: 'communications',          label: 'Communications',          section: 'global' },
    { id: 'cs-score-templates',      label: 'CS Score Templates',      section: 'global' },
    { id: 'email',                   label: 'Email',                   section: 'global' },
    { id: 'response-templates',      label: 'Response Templates',      section: 'global' },
    { id: 'departments',             label: 'Departments',             section: 'global' },
    { id: 'keyword-alerts',          label: 'Keyword Alerts',          section: 'global' },
    { id: 'languages',               label: 'Languages',               section: 'global' },
    { id: 'live-agent',              label: 'Live Agent',              section: 'global' },
    { id: 'locations',               label: 'Locations',               section: 'global' },
    { id: 'tags',                    label: 'Tags',                    section: 'global' },
    { id: 'tags-tickets',            label: 'Tickets',                 section: 'global' },
    { id: 'tags-assets',             label: 'Assets',                  section: 'global' },
    { id: 'user-management',         label: 'User Management',         section: 'global' },
    // Integration Hub
    { id: 'api-tokens',              label: 'API Tokens',              section: 'integration-hub' },
    { id: 'webhooks',                label: 'Webhooks',                section: 'integration-hub' },
    { id: 'marketplace',             label: 'Marketplace',             section: 'integration-hub' },
    { id: 'installed-apps',          label: 'Installed Apps',          section: 'integration-hub' },
    // Workflows
    { id: 'workflows-tickets',       label: 'Tickets',                 section: 'workflows' },
    { id: 'workflows-assets',        label: 'Assets',                  section: 'workflows' },
    { id: 'lookup-tables',           label: 'Lookup Tables',           section: 'workflows' },
    // Tickets Settings
    { id: 'portals',                 label: 'Portals',                 section: 'tickets-settings' },
    { id: 'portals-it-service',      label: 'IT Service',              section: 'tickets-settings' },
    { id: 'portals-landing-page',    label: 'Landing Page / Tab',      section: 'tickets-settings' },
    { id: 'forms',                   label: 'Forms',                   section: 'tickets-settings' },
    { id: 'saved-exports',           label: 'Saved Exports',           section: 'tickets-settings' },
    { id: 'slas',                    label: 'SLAs',                    section: 'tickets-settings' },
    { id: 'ticket-schedules',        label: 'Ticket Schedules',        section: 'tickets-settings' },
    { id: 'topics-manager',          label: 'Topics Manager',          section: 'tickets-settings' },
    { id: 'topics',                  label: 'Topics',                  section: 'tickets-settings' },
    { id: 'success-messages',        label: 'Success Messages',        section: 'tickets-settings' },
    // Assets Settings
    { id: 'archived-assets',         label: 'Archived Assets',         section: 'assets-settings' },
    { id: 'asset-fields',            label: 'Asset Fields',            section: 'assets-settings' },
    { id: 'asset-hierarchy',         label: 'Asset Hierarchy',         section: 'assets-settings' },
    { id: 'funding-sources',         label: 'Funding Sources',         section: 'assets-settings' },
    { id: 'manufacturers',           label: 'Manufacturers',           section: 'assets-settings' },
    { id: 'models',                  label: 'Models',                  section: 'assets-settings' },
    { id: 'purchase-order-details',  label: 'Purchase Order Details',  section: 'assets-settings' },
    { id: 'statuses',                label: 'Statuses',                section: 'assets-settings' },
    { id: 'suppliers',               label: 'Suppliers',               section: 'assets-settings' },
    // Call Center
    { id: 'business-hours',          label: 'Business Hours',          section: 'call-center' },
    { id: 'calendar',                label: 'Calendar',                section: 'call-center' },
    { id: 'call-notes',              label: 'Call Notes',              section: 'call-center' },
    { id: 'contact-numbers',         label: 'Contact Numbers',         section: 'call-center' },
    { id: 'greetings',               label: 'Greetings',               section: 'call-center' },
    { id: 'ivr',                     label: 'IVR',                     section: 'call-center' },
    { id: 'queues',                  label: 'Queues',                  section: 'call-center' },
    { id: 'texting',                 label: 'Texting',                 section: 'call-center' },
  ];

  settingsFilteredIds = computed<Set<string> | null>(() => {
    const q = this.settingsSearchQuery().toLowerCase().trim();
    if (!q) return null;
    return new Set(this._settingsItems
      .filter(item => item.label.toLowerCase().includes(q))
      .map(item => item.id));
  });

  settingsSectionVis = computed(() => {
    const f = this.settingsFilteredIds();
    if (!f) {
      return { global: true, integrationHub: true, workflows: true,
               ticketsSettings: true, assetsSettings: true, callCenter: true };
    }
    const hasAny = (section: string) =>
      this._settingsItems.some(item => item.section === section && f.has(item.id));
    return {
      global:          hasAny('global'),
      integrationHub:  hasAny('integration-hub'),
      workflows:       hasAny('workflows'),
      ticketsSettings: hasAny('tickets-settings'),
      assetsSettings:  hasAny('assets-settings'),
      callCenter:      hasAny('call-center'),
    };
  });

  // ── Agent status ─────────────────────────────────────────────────────────
  // Wire these to your agent availability service

  callOnline  = signal<boolean>(true);
  liveOnline  = signal<boolean>(false);

  private _routeSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Keep activeSection in sync with the browser URL
    this._routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const section = e.urlAfterRedirects.replace(/^\//, '').split('/')[0] as NavSection;
        if (section) this.activeSection.set(section);
      });
  }

  ngOnDestroy(): void {
    this._routeSub?.unsubscribe();
  }

  // ── Nav ──────────────────────────────────────────────────────────────────

  navigate(section: NavSection): void {
    this.router.navigate(['/', section]);
  }

  // ── Tab management ───────────────────────────────────────────────────────

  onTabActivate(tab: DsNavTabItem): void {
    this.tabs.update(tabs =>
      tabs.map(t => ({ ...t, active: t.id === tab.id }))
    );
  }

  onTabClose(tab: DsNavTabItem): void {
    this.tabs.update(tabs => tabs.filter(t => t.id !== tab.id));
  }

  onTabCloseAll(): void {
    this.tabs.set([]);
  }
}
