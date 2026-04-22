import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { CallCenterFilterShellComponent } from './filter-shell/call-center-filter-shell.component';

type CallCenterTab = 'overview' | 'queue-management' | 'csat' | 'call-metrics' | 'call-details' | 'agent-status';

@Component({
  selector: 'app-call-center',
  standalone: true,
  imports: [DsTableToolbarComponent, CallCenterFilterShellComponent],
  templateUrl: './call-center.component.html',
  styleUrls: ['./call-center.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallCenterComponent {
  activeTab = signal<CallCenterTab>('overview');

  filterOpen     = false;
  filterCount    = 0;
  settingsActive = false;

  dateMenuOpen = false;
  dateLabel    = 'Last 90 Days';

  readonly dateOptions = [
    'All Time',
    'Current School Year',
    'Last School Year',
    'Last 90 Days',
    'Last 30 Days',
    'This Month',
    'Last 7 Days',
    'This Week',
  ];

  readonly tabs: { id: CallCenterTab; label: string }[] = [
    { id: 'overview',         label: 'Overview' },
    { id: 'queue-management', label: 'Queue Management' },
    { id: 'csat',             label: 'CSAT' },
    { id: 'call-metrics',     label: 'Call Metrics' },
    { id: 'call-details',     label: 'Call Details' },
    { id: 'agent-status',     label: 'Agent Status' },
  ];

  filterContext = computed(() => {
    const map: Record<CallCenterTab, string> = {
      'overview':         'call-center-overview',
      'queue-management': 'call-center-queue-management',
      'csat':             'call-center-csat',
      'call-metrics':     'call-center-call-metrics',
      'call-details':     'call-center-call-details',
      'agent-status':     'call-center-agent-status',
    };
    return map[this.activeTab()];
  });

  isTableTab = computed(() => this.activeTab() === 'call-details');

  setTab(tab: CallCenterTab): void {
    if (this.activeTab() === tab) return;
    this.filterOpen  = false;
    this.filterCount = 0;
    this.activeTab.set(tab);
  }

  toggleDateMenu(): void  { this.dateMenuOpen = !this.dateMenuOpen; }

  selectDate(label: string): void {
    this.dateLabel    = label;
    this.dateMenuOpen = false;
  }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.filterOpen  = false;
  }
}
