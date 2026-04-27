import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnalyticsFilterShellComponent } from './filter-shell/analytics-filter-shell.component';
import { ShareDashboardModalComponent } from '../shared/share-dashboard-modal/share-dashboard-modal.component';
import { SaveViewModalComponent } from '../shared/save-view-modal/save-view-modal.component';
import { SavedViewsService, SavedView } from '../../../core/services/saved-views.service';

export interface OverviewStat {
  id: string;
  count: number;
  label: string;
}

@Component({
  selector: 'app-service-overview',
  standalone: true,
  imports: [AnalyticsFilterShellComponent, DecimalPipe, DatePipe, ShareDashboardModalComponent, SaveViewModalComponent],
  templateUrl: './service-overview.component.html',
  styleUrls: ['./service-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr               = inject(ChangeDetectorRef);
  private readonly route             = inject(ActivatedRoute);
  private readonly router            = inject(Router);
  private readonly savedViewsService = inject(SavedViewsService);

  @ViewChild(AnalyticsFilterShellComponent) private filterShell!: AnalyticsFilterShellComponent;

  readonly lastUpdated = new Date();

  isSavedView      = false;
  currentSavedView: SavedView | null = null;

  filterOpen           = false;
  filterCount          = 0;
  filterDateActive     = false;
  filterBarCollapsed   = signal(false);
  dateMenuOpen         = false;
  dateLabel            = 'Last 90 Days';
  shareOpen            = false;
  saveViewModalOpen    = false;
  saveViewModalMode: 'save' | 'edit' = 'save';

  private _viewReady = false;
  private _paramSub?: Subscription;

  private readonly onDateRangeSelected = (e: Event) => {
    const { label } = (e as CustomEvent<{ label: string }>).detail;
    this.dateLabel = label;
    this.cdr.markForCheck();
  };

  readonly stats: OverviewStat[] = [
    { id: 'total',    count: 16390, label: 'Total Tickets' },
    { id: 'open',     count: 126,   label: 'Tickets Currently Open' },
    { id: 'critical', count: 5,     label: 'Unresolved Critical Tickets' },
    { id: 'past-due', count: 79,    label: 'Past Due Tickets' },
  ];

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

  ngOnInit(): void {
    this._paramSub = this.route.paramMap.subscribe(params => {
      const id   = params.get('id');
      const view = id ? this.savedViewsService.getById(id) : null;

      if (view) {
        this.isSavedView      = true;
        this.currentSavedView = view;
        this.dateLabel        = view.dateLabel;
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

      // On subsequent param changes (navigating between saved views), the view is
      // already initialized so apply filter state immediately.
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

  openStat(stat: OverviewStat) {
    // TODO: navigate to tickets page filtered by stat.id
  }

  onShare() {
    this.shareOpen = true;
  }

  onSave() {
    this.saveViewModalMode = 'save';
    this.saveViewModalOpen = true;
  }

  onEditView() {
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
        dateLabel: this.dateLabel,
      });
      this.currentSavedView = {
        ...this.currentSavedView,
        name,
        filterCount: this.filterCount,
        dateLabel: this.dateLabel,
      };
      this.cdr.markForCheck();
    } else {
      const newView = this.savedViewsService.save({
        name,
        sourcePage: 'service-overview',
        filterState: filterState as unknown as SavedView['filterState'],
        filterCount: this.filterCount,
        dateLabel: this.dateLabel,
      });
      this.router.navigate(['/analytics/saved-views', newView.id]);
    }
  }

  onSaveViewDeleted(): void {
    if (this.currentSavedView) {
      this.savedViewsService.delete(this.currentSavedView.id);
    }
    this.router.navigate(['/analytics/service-overview']);
  }

  onDownload() {
    // TODO: export dashboard data
  }

  toggleDateMenu() {
    this.dateMenuOpen = !this.dateMenuOpen;
  }

  selectDate(label: string) {
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

  onFilterDateActiveChange(active: boolean) {
    this.filterDateActive = active;
    this.cdr.markForCheck();
  }

  ngOnDestroy() {
    window.removeEventListener('dateRangeSelected', this.onDateRangeSelected);
    this._paramSub?.unsubscribe();
  }

  onFilterCountChange(count: number) {
    this.filterCount = count;
    this.filterOpen  = false;
    if (count === 0 && !this.isSavedView) this.filterBarCollapsed.set(false);
    this.cdr.markForCheck();
  }

  toggleFilterBar(): void {
    this.filterBarCollapsed.update(v => !v);
  }
}
