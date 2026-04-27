import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { CallCenterFilterShellComponent } from './filter-shell/call-center-filter-shell.component';
import { ShareDashboardModalComponent } from '../shared/share-dashboard-modal/share-dashboard-modal.component';

type CallCenterTab = 'overview' | 'queue-management' | 'csat' | 'call-metrics' | 'call-details' | 'agent-status';

@Component({
  selector: 'app-call-center',
  standalone: true,
  imports: [DatePipe, DsTableToolbarComponent, CallCenterFilterShellComponent, ShareDashboardModalComponent],
  templateUrl: './call-center.component.html',
  styleUrls: ['./call-center.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallCenterComponent implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  activeTab = signal<CallCenterTab>('overview');

  filterOpen          = false;
  filterCount         = 0;
  filterDateActive    = false;
  filterBarCollapsed  = signal(false);
  shareOpen           = false;
  settingsActive      = false;

  dateMenuOpen      = false;
  tableDateMenuOpen = false;
  dateLabel      = 'Last 90 Days';
  tableDateLabel = 'Last 90 Days';
  readonly lastUpdated = new Date();

  private readonly onDateRangeSelected = (e: Event) => {
    const { label } = (e as CustomEvent<{ label: string }>).detail;
    this.dateLabel = label;
    this.cdr.markForCheck();
  };

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

  readonly tabs: { id: CallCenterTab; label: string; live?: boolean }[] = [
    { id: 'overview',         label: 'Overview' },
    { id: 'queue-management', label: 'Queue Management', live: true },
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

  isCallDetailsTab    = computed(() => this.activeTab() === 'call-details');
  isAgentStatusTab    = computed(() => this.activeTab() === 'agent-status');
  isTableTab          = computed(() => this.isCallDetailsTab() || this.isAgentStatusTab());
  isQueueManagementTab = computed(() => this.activeTab() === 'queue-management');

  // Queue Management inline filter
  queueMenuOpen  = signal(false);
  selectedQueues = signal<string[]>([]);

  readonly queueOptions = [
    'General Inquiries',
    'Enrollment',
    'Transportation',
    'Special Education',
    'Nutrition Services',
    'Human Resources',
    'Technology Support',
  ];

  queueLabel = computed(() => {
    const sel = this.selectedQueues();
    if (sel.length === 0) return 'All Queues';
    if (sel.length === 1) return sel[0];
    return `${sel.length} Queues`;
  });

  toggleQueueMenu(): void { this.queueMenuOpen.update(v => !v); }

  isQueueSelected(queue: string): boolean { return this.selectedQueues().includes(queue); }

  toggleQueue(queue: string): void {
    this.selectedQueues.update(current =>
      current.includes(queue) ? current.filter(q => q !== queue) : [...current, queue]
    );
  }

  clearQueues(): void {
    this.selectedQueues.set([]);
    this.queueMenuOpen.set(false);
  }

  setTab(tab: CallCenterTab): void {
    if (this.activeTab() === tab) return;
    this.filterOpen        = false;
    this.filterCount       = 0;
    this.filterBarCollapsed.set(false);
    this.queueMenuOpen.set(false);
    this.tableDateMenuOpen = false;
    this.activeTab.set(tab);
  }

  toggleDateMenu():      void { this.dateMenuOpen      = !this.dateMenuOpen; }
  toggleTableDateMenu(): void { this.tableDateMenuOpen = !this.tableDateMenuOpen; }

  selectTableDate(label: string): void {
    this.tableDateLabel    = label;
    this.tableDateMenuOpen = false;
  }

  selectDate(label: string): void {
    this.dateMenuOpen = false;
    if (this.filterDateActive) {
      window.filterModalClearDates?.();
    }
    if (label === 'Custom Date Range') {
      window.addEventListener('dateRangeSelected', this.onDateRangeSelected, { once: true });
      window.openDateRangePicker?.();
    } else {
      this.dateLabel = label;
    }
  }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.filterOpen  = false;
    if (count === 0) this.filterBarCollapsed.set(false);
  }

  toggleFilterBar(): void {
    this.filterBarCollapsed.update(v => !v);
  }

  onFilterDateActiveChange(active: boolean): void {
    this.filterDateActive = active;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    window.removeEventListener('dateRangeSelected', this.onDateRangeSelected);
  }

  onDownload(): void { /* TODO */ }
  onShare():    void { this.shareOpen = true; }
  onSave():     void { /* TODO */ }
}
