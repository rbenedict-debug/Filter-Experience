import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComparisonTopicsFilterShellComponent } from './filter-shell/comparison-topics-filter-shell.component';

@Component({
  selector: 'app-comparison-topics',
  standalone: true,
  imports: [ComparisonTopicsFilterShellComponent],
  templateUrl: './comparison-topics.component.html',
  styleUrls: ['./comparison-topics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonTopicsComponent {
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
