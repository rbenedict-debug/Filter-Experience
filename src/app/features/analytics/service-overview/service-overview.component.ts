import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AnalyticsFilterShellComponent } from './filter-shell/analytics-filter-shell.component';

@Component({
  selector: 'app-service-overview',
  standalone: true,
  imports: [AnalyticsFilterShellComponent],
  templateUrl: './service-overview.component.html',
  styleUrls: ['./service-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOverviewComponent {
  filterOpen = false;
  filterCount = 0;
  dateMenuOpen = false;
  dateLabel = 'Last 90 Days';

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

  toggleDateMenu() {
    this.dateMenuOpen = !this.dateMenuOpen;
  }

  selectDate(label: string) {
    this.dateLabel = label;
    this.dateMenuOpen = false;
  }

  onFilterCountChange(count: number) {
    this.filterCount = count;
    this.filterOpen = false;
  }
}
