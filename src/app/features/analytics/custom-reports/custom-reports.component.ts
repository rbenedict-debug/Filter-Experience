import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  filterOpen     = false;
  filterCount    = 0;
  settingsActive = false;

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.filterOpen  = false;
  }
}
