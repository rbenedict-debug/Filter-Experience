import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComparisonCategoriesFilterShellComponent } from './filter-shell/comparison-categories-filter-shell.component';

@Component({
  selector: 'app-comparison-categories',
  standalone: true,
  imports: [ComparisonCategoriesFilterShellComponent],
  templateUrl: './comparison-categories.component.html',
  styleUrls: ['./comparison-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonCategoriesComponent {
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
