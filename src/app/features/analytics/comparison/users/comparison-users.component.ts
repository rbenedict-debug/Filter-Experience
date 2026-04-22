import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComparisonUsersFilterShellComponent } from './filter-shell/comparison-users-filter-shell.component';

@Component({
  selector: 'app-comparison-users',
  standalone: true,
  imports: [ComparisonUsersFilterShellComponent],
  templateUrl: './comparison-users.component.html',
  styleUrls: ['./comparison-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonUsersComponent {
  filterOpen   = false;
  filterCount  = 0;
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
