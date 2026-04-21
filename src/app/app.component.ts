import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  WritableSignal,
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

interface SettingsItem {
  id: string;
  label: string;
  section: string;
  isSubheader?: boolean;
  subheaderParent?: string;
}

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

  tabs = signal<DsNavTabItem[]>([]);

  private readonly _sectionTab: Record<NavSection, DsNavTabItem> = {
    tickets:   { id: 1, label: 'Inbox',     active: false },
    assets:    { id: 2, label: 'Assets',    active: false },
    analytics: { id: 3, label: 'Analytics', active: false },
    settings:  { id: 4, label: 'Settings',  active: false },
  };

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

  settingsSubnavHovered     = signal<boolean>(false);
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

  // Maps for guarded expand/collapse handlers — populated in constructor
  private _settingsSectionSignals!: Record<string, WritableSignal<boolean>>;
  private _settingsSubheaderSignals!: Record<string, WritableSignal<boolean>>;

  // Tracks whether a search was active so we can react to clearing it
  private _wasSearching = false;

  private readonly _settingsSectionLabels: Record<string, string> = {
    'global':           'Global',
    'integration-hub':  'Integration Hub',
    'workflows':        'Workflows',
    'tickets-settings': 'Tickets',
    'assets-settings':  'Assets',
    'call-center':      'Call Center',
  };

  private readonly _settingsItems: SettingsItem[] = [
    // Global
    { id: 'district-profile',        label: 'District Profile',        section: 'global' },
    { id: 'activity-log',            label: 'Activity Log',            section: 'global',           isSubheader: true },
    { id: 'activity-log-onflo',      label: 'Onflo',                   section: 'global',           subheaderParent: 'activity-log' },
    { id: 'activity-log-assets',     label: 'Assets',                  section: 'global',           subheaderParent: 'activity-log' },
    { id: 'ai-training',             label: 'AI Training Resources',   section: 'global' },
    { id: 'chatbot',                 label: 'Chatbot',                 section: 'global' },
    { id: 'communications',          label: 'Communications',          section: 'global',           isSubheader: true },
    { id: 'cs-score-templates',      label: 'CS Score Templates',      section: 'global',           subheaderParent: 'communications' },
    { id: 'email',                   label: 'Email',                   section: 'global',           subheaderParent: 'communications' },
    { id: 'response-templates',      label: 'Response Templates',      section: 'global',           subheaderParent: 'communications' },
    { id: 'departments',             label: 'Departments',             section: 'global' },
    { id: 'keyword-alerts',          label: 'Keyword Alerts',          section: 'global' },
    { id: 'languages',               label: 'Languages',               section: 'global' },
    { id: 'live-agent',              label: 'Live Agent',              section: 'global' },
    { id: 'locations',               label: 'Locations',               section: 'global' },
    { id: 'tags',                    label: 'Tags',                    section: 'global',           isSubheader: true },
    { id: 'tags-tickets',            label: 'Tickets',                 section: 'global',           subheaderParent: 'tags' },
    { id: 'tags-assets',             label: 'Assets',                  section: 'global',           subheaderParent: 'tags' },
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
    { id: 'portals',                 label: 'Portals',                 section: 'tickets-settings', isSubheader: true },
    { id: 'portals-it-service',      label: 'IT Service',              section: 'tickets-settings', subheaderParent: 'portals' },
    { id: 'portals-landing-page',    label: 'Landing Page / Tab',      section: 'tickets-settings', subheaderParent: 'portals' },
    { id: 'forms',                   label: 'Forms',                   section: 'tickets-settings' },
    { id: 'saved-exports',           label: 'Saved Exports',           section: 'tickets-settings' },
    { id: 'slas',                    label: 'SLAs',                    section: 'tickets-settings' },
    { id: 'ticket-schedules',        label: 'Ticket Schedules',        section: 'tickets-settings' },
    { id: 'topics-manager',          label: 'Topics Manager',          section: 'tickets-settings', isSubheader: true },
    { id: 'topics',                  label: 'Topics',                  section: 'tickets-settings', subheaderParent: 'topics-manager' },
    { id: 'success-messages',        label: 'Success Messages',        section: 'tickets-settings', subheaderParent: 'topics-manager' },
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

  // Returns null when no query (show everything), or the set of item IDs that match.
  // Matching a section header label includes all items in that section.
  // Matching a subheader label includes all child items of that subheader.
  settingsFilteredIds = computed<Set<string> | null>(() => {
    const q = this.settingsSearchQuery().toLowerCase().trim();
    if (!q) return null;

    const matchingSectionKeys = new Set(
      Object.entries(this._settingsSectionLabels)
        .filter(([, label]) => label.toLowerCase().includes(q))
        .map(([key]) => key)
    );

    const matchingSubheaderIds = new Set(
      this._settingsItems
        .filter(item => item.isSubheader && item.label.toLowerCase().includes(q))
        .map(item => item.id)
    );

    const result = new Set<string>();
    for (const item of this._settingsItems) {
      if (
        item.label.toLowerCase().includes(q) ||
        matchingSectionKeys.has(item.section) ||
        (item.subheaderParent !== undefined && matchingSubheaderIds.has(item.subheaderParent))
      ) {
        result.add(item.id);
      }
    }
    return result;
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

  callOnline  = signal<boolean>(true);
  liveOnline  = signal<boolean>(false);

  private _routeSub?: Subscription;

  constructor(private router: Router) {
    this._settingsSectionSignals = {
      'global':           this.globalExpanded,
      'integration-hub':  this.integrationHubExpanded,
      'workflows':        this.workflowsExpanded,
      'tickets-settings': this.ticketsSettingsExpanded,
      'assets-settings':  this.assetsSettingsExpanded,
      'call-center':      this.callCenterExpanded,
    };
    this._settingsSubheaderSignals = {
      'activity-log':   this.activityLogExpanded,
      'communications': this.communicationsExpanded,
      'tags':           this.tagsExpanded,
      'portals':        this.portalsExpanded,
      'topics-manager': this.topicsManagerExpanded,
    };

    // When search is cleared, expand the section (and subheader if applicable)
    // for the currently active settings page so the user can see where they are.
    effect(() => {
      const q = this.settingsSearchQuery();
      if (!q && this._wasSearching) {
        this._wasSearching = false;
        this._expandForCurrentNavItem();
      } else if (q) {
        this._wasSearching = true;
      }
    });
  }

  ngOnInit(): void {
    this._syncNavFromUrl(this.router.url);
    this._routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this._syncNavFromUrl(e.urlAfterRedirects);
      });
  }

  private _syncNavFromUrl(url: string): void {
    const parts = url.replace(/^\//, '').split('/');
    const section = parts[0] as NavSection;
    const p1 = parts[1] ?? '';
    const p2 = parts[2] ?? '';

    if (!section) return;
    this.activeSection.set(section);
    this.openOrActivateTab(section);

    if (section === 'tickets') {
      this.ticketsNavItem.set(p1 || 'inbox');
    } else if (section === 'assets') {
      this.assetsNavItem.set(p1 || 'asset-views');
    } else if (section === 'analytics') {
      if (p1 === 'comparison' && p2) {
        this.analyticsNavItem.set(`comparison-${p2}`);
      } else {
        this.analyticsNavItem.set(p1 || 'service-overview');
      }
    } else if (section === 'settings') {
      if (p2) {
        const combined = p1 === 'workflows' && p2 === 'lookup-tables'
          ? 'lookup-tables'
          : `${p1}-${p2}`;
        this.settingsNavItem.set(combined);
      } else {
        this.settingsNavItem.set(p1 || 'district-profile');
      }
      this._expandForCurrentNavItem();
    }
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
  }

  ngOnDestroy(): void {
    this._routeSub?.unsubscribe();
  }

  // ── Settings expand/collapse — guarded so search can't overwrite saved state ──

  onSettingsExpand(section: string, value: boolean): void {
    if (this.settingsSearchQuery()) return;
    this._settingsSectionSignals[section]?.set(value);
  }

  onSettingsSubheaderExpand(subheader: string, value: boolean): void {
    if (this.settingsSearchQuery()) return;
    this._settingsSubheaderSignals[subheader]?.set(value);
  }

  private _expandForCurrentNavItem(): void {
    const itemId = this.settingsNavItem();
    const item = this._settingsItems.find(i => i.id === itemId);
    if (!item) return;
    this._settingsSectionSignals[item.section]?.set(true);
    if (item.subheaderParent) {
      this._settingsSubheaderSignals[item.subheaderParent]?.set(true);
    }
  }

  // ── Nav ──────────────────────────────────────────────────────────────────

  navigate(section: NavSection): void {
    this.router.navigate(['/', section]);
  }

  // ── Tab management ───────────────────────────────────────────────────────

  private openOrActivateTab(section: NavSection): void {
    const def = this._sectionTab[section];
    this.tabs.update(tabs => {
      const exists = tabs.some(t => t.id === def.id);
      const deactivated = tabs.map(t => ({ ...t, active: t.id === def.id }));
      if (exists) return deactivated;
      return [...tabs.map(t => ({ ...t, active: false })), { ...def, active: true }];
    });
  }

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
