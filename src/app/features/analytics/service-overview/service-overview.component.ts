import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { AnalyticsFilterShellComponent } from './filter-shell/analytics-filter-shell.component';

export interface OverviewStat {
  id: string;
  count: number;
  label: string;
}

@Component({
  selector: 'app-service-overview',
  standalone: true,
  imports: [AnalyticsFilterShellComponent, DecimalPipe, DatePipe],
  templateUrl: './service-overview.component.html',
  styleUrls: ['./service-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOverviewComponent implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly lastUpdated = new Date();
  filterOpen = false;
  filterCount = 0;
  filterDateActive = false;
  dateMenuOpen = false;
  dateLabel = 'Last 90 Days';

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

  openStat(stat: OverviewStat) {
    // TODO: navigate to tickets page filtered by stat.id
  }

  onShare() {
    // TODO: open share dialog
  }

  onSave() {
    // TODO: save current dashboard view as snapshot
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
  }

  onFilterCountChange(count: number) {
    this.filterCount = count;
    this.filterOpen = false;
  }
}
