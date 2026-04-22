import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { FeesFilterShellComponent } from './filter-shell/fees-filter-shell.component';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [DsTableToolbarComponent, FeesFilterShellComponent],
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeesComponent {
  filterOpen     = false;
  filterCount    = 0;
  settingsActive = false;

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.filterOpen  = false;
  }
}
