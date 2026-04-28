import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DsTableToolbarComponent } from '@onflo/design-system';

@Component({
  selector: 'app-by-locations',
  standalone: true,
  imports: [DsTableToolbarComponent],
  templateUrl: './by-locations.component.html',
  styleUrls: ['./by-locations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByLocationsComponent {
  activeTab = signal<'building' | 'room' | 'container' | 'special-area'>('building');
  setTab(tab: 'building' | 'room' | 'container' | 'special-area'): void { this.activeTab.set(tab); }

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
