import {
  Component,
  ChangeDetectionStrategy,
  signal,
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
