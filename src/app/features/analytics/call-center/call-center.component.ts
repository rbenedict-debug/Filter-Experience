import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  inject,
  signal,
  computed,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { CallCenterFilterShellComponent } from './filter-shell/call-center-filter-shell.component';
import { ShareDashboardModalComponent } from '../shared/share-dashboard-modal/share-dashboard-modal.component';
import { SaveViewModalComponent } from '../shared/save-view-modal/save-view-modal.component';
import { SavedViewsService, SavedView } from '../../../core/services/saved-views.service';

type CallCenterTab = 'overview' | 'queue-management' | 'csat' | 'call-metrics' | 'call-details' | 'agent-status';

@Component({
  selector: 'app-call-center',
  standalone: true,
  imports: [DatePipe, DsTableToolbarComponent, CallCenterFilterShellComponent, ShareDashboardModalComponent, SaveViewModalComponent],
  templateUrl: './call-center.component.html',
  styleUrls: ['./call-center.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallCenterComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr               = inject(ChangeDetectorRef);
  private readonly route             = inject(ActivatedRoute);
  private readonly router            = inject(Router);
  private readonly savedViewsService = inject(SavedViewsService);

  @ViewChild(CallCenterFilterShellComponent) private filterShell!: CallCenterFilterShellComponent;

  activeTab = signal<CallCenterTab>('overview');

  isSavedView       = false;
  currentSavedView: SavedView | null = null;
  saveViewModalOpen = false;
  saveViewModalMode: 'save' | 'edit' = 'save';

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

  private _viewReady = false;
  private _paramSub?: Subscription;

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

  isCallDetailsTab     = computed(() => this.activeTab() === 'call-details');
  isAgentStatusTab     = computed(() => this.activeTab() === 'agent-status');
  isTableTab           = computed(() => this.isCallDetailsTab() || this.isAgentStatusTab());
  isQueueManagementTab = computed(() => this.activeTab() === 'queue-management');

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

  ngOnInit(): void {
    this._paramSub = this.route.paramMap.subscribe(params => {
      const id   = params.get('id');
      const view = id ? this.savedViewsService.getById(id) : null;

      if (view) {
        this.isSavedView      = true;
        this.currentSavedView = view;
        this.dateLabel        = view.dateLabel || 'Last 90 Days';
        this.filterCount      = view.filterCount;
        this.filterBarCollapsed.set(true);
      } else {
        this.isSavedView      = false;
        this.currentSavedView = null;
        this.dateLabel        = 'Last 90 Days';
        this.filterBarCollapsed.set(false);
        this.filterCount      = 0;
      }
      this.cdr.markForCheck();

      if (this._viewReady) {
        if (view) {
          this.filterShell.setState(view.filterState as unknown as Record<string, unknown>);
          this.filterShell.applySilent();
        } else {
          this.filterShell.resetState();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this._viewReady = true;
    if (this.isSavedView && this.currentSavedView) {
      this.filterShell.setState(this.currentSavedView.filterState as unknown as Record<string, unknown>);
      this.filterShell.applySilent();
    } else {
      this.filterShell.resetState();
    }
  }

  onSave(): void {
    this.saveViewModalMode = 'save';
    this.saveViewModalOpen = true;
  }

  onEditView(): void {
    this.saveViewModalMode = 'edit';
    this.saveViewModalOpen = true;
  }

  onSaveViewConfirmed(name: string): void {
    const filterState = this.filterShell.getState();
    if (!filterState) return;

    if (this.isSavedView && this.currentSavedView) {
      this.savedViewsService.update(this.currentSavedView.id, {
        name,
        filterState: filterState as unknown as SavedView['filterState'],
        filterCount: this.filterCount,
        dateLabel:   this.dateLabel,
      });
      this.currentSavedView = { ...this.currentSavedView, name, filterCount: this.filterCount, dateLabel: this.dateLabel };
      this.cdr.markForCheck();
    } else {
      const newView = this.savedViewsService.save({
        name,
        sourcePage:  'call-center',
        filterState: filterState as unknown as SavedView['filterState'],
        filterCount: this.filterCount,
        dateLabel:   this.dateLabel,
      });
      this.router.navigate(['/analytics/call-center/saved-views', newView.id]);
    }
  }

  onSaveViewDeleted(): void {
    if (this.currentSavedView) {
      this.savedViewsService.delete(this.currentSavedView.id);
    }
    this.router.navigate(['/analytics/call-center']);
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
    if (count === 0 && !this.isSavedView) this.filterBarCollapsed.set(false);
    this.cdr.markForCheck();
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
    this._paramSub?.unsubscribe();
  }

  onDownload(): void {}
  onShare():    void { this.shareOpen = true; }
}
