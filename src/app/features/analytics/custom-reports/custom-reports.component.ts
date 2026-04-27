import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { CustomReportsFilterShellComponent } from './filter-shell/custom-reports-filter-shell.component';

@Component({
  selector: 'app-custom-reports',
  standalone: true,
  imports: [DsTableToolbarComponent, CustomReportsFilterShellComponent],
  templateUrl: './custom-reports.component.html',
  styleUrls: ['./custom-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomReportsComponent {
  filterOpen          = false;
  filterCount         = 0;
  settingsActive      = false;
  selectedCount       = signal(0);
  filterBarCollapsed  = signal(false);

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.filterOpen  = false;
    if (count === 0) this.filterBarCollapsed.set(false);
  }

  toggleFilterBar(): void {
    this.filterBarCollapsed.update(v => !v);
  }

  onAddReport(): void {}

  onDeleteSelected(): void {}
}
