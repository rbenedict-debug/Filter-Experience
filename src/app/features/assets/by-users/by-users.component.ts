import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DsTableToolbarComponent } from '@onflo/design-system';

@Component({
  selector: 'app-by-users',
  standalone: true,
  imports: [DsTableToolbarComponent],
  templateUrl: './by-users.component.html',
  styleUrls: ['./by-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByUsersComponent {
  settingsActive     = false;
  filterOpen         = false;
  filterCount        = 0;
  filterBarCollapsed = signal(false);

  onSettingsToggle(active: boolean): void { this.settingsActive = active; }
  onFilterToggle(active: boolean): void   { this.filterOpen = active; }
  onFilterCountChange(count: number): void {
    this.filterCount = count;
    if (count === 0) this.filterBarCollapsed.set(false);
  }
  toggleFilterBar(): void { this.filterBarCollapsed.update(v => !v); }
}
