import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  inject,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComparisonUsersFilterShellComponent } from './filter-shell/comparison-users-filter-shell.component';
import { ShareDashboardModalComponent } from '../../shared/share-dashboard-modal/share-dashboard-modal.component';
import { NotifyUsersModalComponent } from '../../shared/notify-users-modal/notify-users-modal.component';
import { SaveViewModalComponent } from '../../shared/save-view-modal/save-view-modal.component';
import { SavedViewsService, SavedView } from '../../../../core/services/saved-views.service';

export interface ComparisonUsersStat {
  id: string;
  value: string;
  label: string;
}

@Component({
  selector: 'app-comparison-users',
  standalone: true,
  imports: [DatePipe, ComparisonUsersFilterShellComponent, ShareDashboardModalComponent, NotifyUsersModalComponent, SaveViewModalComponent],
  templateUrl: './comparison-users.component.html',
  styleUrls: ['./comparison-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonUsersComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr               = inject(ChangeDetectorRef);
  private readonly route             = inject(ActivatedRoute);
  private readonly router            = inject(Router);
  private readonly savedViewsService = inject(SavedViewsService);

  @ViewChild(ComparisonUsersFilterShellComponent) private filterShell!: ComparisonUsersFilterShellComponent;

  isSavedView       = false;
  currentSavedView: SavedView | null = null;
  saveViewModalOpen = false;
  saveViewModalMode: 'save' | 'edit' = 'save';

  filterOpen          = false;
  filterCount         = 0;
  filterDateActive    = false;
  filterBarCollapsed  = signal(false);
  dateMenuOpen        = false;
  dateLabel           = 'Last 90 Days';
  shareOpen           = false;
  notifyOpen          = false;
  readonly lastUpdated = new Date();

  private _viewReady = false;
  private _paramSub?: Subscription;

  readonly stats: ComparisonUsersStat[] = [
    { id: 'total',      value: '16,399', label: 'Total Tickets' },
    { id: 'ticket-age', value: '2.5',    label: 'Ticket Age' },
    { id: 'cx-score',   value: '8.7',    label: 'Cx Score' },
    { id: 'past-due',   value: '85',     label: 'Past Due' },
    { id: 'critical',   value: '5',      label: 'Unresolved Critical' },
  ];

  openStat(_stat: ComparisonUsersStat): void {}

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
        sourcePage:  'comparison-users',
        filterState: filterState as unknown as SavedView['filterState'],
        filterCount: this.filterCount,
        dateLabel:   this.dateLabel,
      });
      this.router.navigate(['/analytics/comparison/users/saved-views', newView.id]);
    }
  }

  onSaveViewDeleted(): void {
    if (this.currentSavedView) {
      this.savedViewsService.delete(this.currentSavedView.id);
    }
    this.router.navigate(['/analytics/comparison/users']);
  }

  toggleDateMenu(): void { this.dateMenuOpen = !this.dateMenuOpen; }

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

  onDownload(): void {}
  onShare():    void { this.shareOpen = true; }
  onSendMessage(): void { this.notifyOpen = true; }

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
}
