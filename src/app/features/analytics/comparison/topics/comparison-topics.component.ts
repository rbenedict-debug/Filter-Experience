import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ComparisonTopicsFilterShellComponent } from './filter-shell/comparison-topics-filter-shell.component';
import { ShareDashboardModalComponent } from '../../shared/share-dashboard-modal/share-dashboard-modal.component';
import { NotifyUsersModalComponent } from '../../shared/notify-users-modal/notify-users-modal.component';

export interface ComparisonTopicsStat {
  id: string;
  value: string;
  label: string;
}

@Component({
  selector: 'app-comparison-topics',
  standalone: true,
  imports: [DatePipe, ComparisonTopicsFilterShellComponent, ShareDashboardModalComponent, NotifyUsersModalComponent],
  templateUrl: './comparison-topics.component.html',
  styleUrls: ['./comparison-topics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonTopicsComponent implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  filterOpen          = false;
  filterCount         = 0;
  filterDateActive    = false;
  filterBarCollapsed  = signal(false);
  dateMenuOpen        = false;
  dateLabel           = 'Last 90 Days';
  shareOpen           = false;
  notifyOpen          = false;
  readonly lastUpdated = new Date();

  readonly stats: ComparisonTopicsStat[] = [
    { id: 'total',      value: '108', label: 'Total Tickets' },
    { id: 'ticket-age', value: '5.8', label: 'Ticket Age' },
    { id: 'cx-score',   value: '9.8', label: 'Cx Score' },
    { id: 'past-due',   value: '50',  label: 'Past Due' },
    { id: 'critical',   value: '1',   label: 'Unresolved Critical' },
  ];

  openStat(stat: ComparisonTopicsStat): void {
    // TODO: navigate to tickets filtered by topic stat
  }

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

  onSave(): void {}
  onDownload(): void {}
  onShare(): void { this.shareOpen = true; }
  onSendMessage(): void { this.notifyOpen = true; }

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
}
